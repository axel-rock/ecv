import { PRIVATE_OPEN_AI_API_KEY, PRIVATE_PINECONE_API_KEY } from '$env/static/private'
import type { PageServerLoad } from './$types'
import movies from '../../movies.json'
import pThrottle from 'p-throttle'

const host = 'https://ecv-1652e37.svc.aped-4627-b74a.pinecone.io'

export const load = (async () => {
	return {}
}) satisfies PageServerLoad

async function getEmbeddings(prompt: string) {
	const res = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PRIVATE_OPEN_AI_API_KEY}`,
		},
		body: JSON.stringify({
			model: 'text-embedding-3-small',
			input: prompt,
		}),
	})

	const { data } = await res.json()

	return data
}

async function addVector(content: any) {
	if (typeof content !== 'string') content = JSON.stringify(content)

	const embeddings = await getEmbeddings(content)

	const res = await fetch(`${host}/vectors/upsert`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Api-Key': PRIVATE_PINECONE_API_KEY,
			'X-Pinecone-API-Version': '2024-10',
		},
		body: JSON.stringify({
			vectors: [
				{
					id: new Date().getTime().toString(),
					values: embeddings[0].embedding,
					metadata: {
						content,
					},
				},
			],
		}),
	})

	if (res.status !== 200) {
		console.error(res)
		throw new Error(res.statusText)
	}

	const { data } = await res.json()

	console.log(data)
}

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData()
		const embeddings = await getEmbeddings(formData.get('prompt') as string)

		return {
			embedding: embeddings[0].embedding,
		}
	},

	store: async ({ request }) => {
		const formData = await request.formData()
		const content = formData.get('content') as string

		await addVector(content)
	},

	importMovies: async () => {
		await Promise.all((movies as any[]).map(throttledImport))
	},
}

const throttle = pThrottle({ limit: 1000, interval: 1000 })
const throttledImport = throttle(async (movie: any) => {
	console.count('imported')
	// console.log(movie.title)
	return addVector(movie)
})

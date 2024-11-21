import { PRIVATE_OPEN_AI_API_KEY, PRIVATE_PINECONE_API_KEY } from '$env/static/private'
import type { PageServerLoad } from './$types'

const host = 'https://ecv-1652e37.svc.aped-4627-b74a.pinecone.io'
const default_vector = Array(1536).fill(0)

export const load = (async () => {
	// const samples = await query('The Matrix by the Wachowskis')
	// return {
	// 	samples,
	// }
}) satisfies PageServerLoad

async function query(
	needle?: string,
	params: Record<string, any> = { topK: 1, includeMetadata: true },
) {
	const vector = needle ? (await getEmbeddings([needle]))[0].embedding : default_vector

	const req = await fetch(`${host}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Api-Key': PRIVATE_PINECONE_API_KEY,
			'X-Pinecone-API-Version': '2024-10',
		},
		body: JSON.stringify({
			vector,
			...params,
		}),
	})

	const { matches } = (await req.json()) as { matches: any[] }

	return matches
}

async function getEmbeddings(input: string[]) {
	const res = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PRIVATE_OPEN_AI_API_KEY}`,
		},
		body: JSON.stringify({
			model: 'text-embedding-3-small',
			input: input,
		}),
	})

	const { data } = await res.json()

	return data
}

function clearObject(object: Object) {
	return Object.entries(object).reduce((acc, [key, value]) => {
		if (value === null) return acc
		if (typeof value === 'object') {
			if (Array.isArray(value)) {
				if (value.length === 0) return acc
			} else {
				if (Object.keys(value).length === 0) return acc
			}
		}

		return { ...acc, [key]: value }
	})
}

async function addVectors(content: any[]) {
	const embeddings = await getEmbeddings(content.map((c) => JSON.stringify(c)))

	const vectors = content.map((c, i) => {
		return {
			id: new Date().getTime().toString() + '-' + i,
			values: embeddings[i].embedding,
			metadata: clearObject(c),
		}
	})

	const res = await fetch(`${host}/vectors/upsert`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Api-Key': PRIVATE_PINECONE_API_KEY,
			'X-Pinecone-API-Version': '2024-10',
		},
		body: JSON.stringify({
			vectors,
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
		const embeddings = await getEmbeddings([formData.get('prompt') as string])

		return {
			embedding: embeddings[0].embedding,
		}
	},

	store: async ({ request }) => {
		const formData = await request.formData()
		const content = formData.get('content') as string

		await addVectors([content])
	},

	query: async ({ request }) => {
		const formData = await request.formData()
		const needle = formData.get('needle') as string

		console.log(needle)

		return {
			search_result: await query(needle, {
				topK: 5,
				includeMetadata: true,
			}),
		}
	},
}

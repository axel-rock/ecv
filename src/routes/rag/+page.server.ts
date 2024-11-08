import { PRIVATE_OPEN_AI_API_KEY, PRIVATE_PINECONE_API_KEY } from '$env/static/private'
import type { PageServerLoad } from './$types'

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
		const host = 'https://ecv-1652e37.svc.aped-4627-b74a.pinecone.io'
		const content = formData.get('content') as string

		const embeddings = await getEmbeddings(content)

		// console.log(embeddings[0].embedding)

		console.log(
			JSON.stringify({
				vectors: [
					{
						// id: 'A',
						values: embeddings[0].embedding.length,
						metadata: {
							content,
						},
					},
				],
			}),
		)

		const res = await fetch(`${host}/vectors/upsert`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Pinecone-API-Key': PRIVATE_PINECONE_API_KEY,
				'X-Pinecone-API-Version': '2024-07',
			},
			body: JSON.stringify({
				vectors: [
					{
						id: Math.random().toString(),
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
	},
}

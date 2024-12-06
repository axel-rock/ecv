import { PRIVATE_OPEN_AI_API_KEY } from '$env/static/private'
import { z } from 'zod'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const content = formData.get('content') as string

		const format = z.object({
			response: z.string(),
			emotion: z.string().length(1),
		})
		// const

		const req = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${PRIVATE_OPEN_AI_API_KEY}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `Response with an JSON object in the following format
            {
              response: 'Your response',
              emotion: 'An emoji of how this message makes you feel'
            }`,
					},
					{ role: 'user', content },
				],
				response_format: { type: 'json_object' },
			}),
		})

		console.log(req)

		const data = await req.json()

		return {
			response: data.choices[0].message.content,
		}
	},
}

import { PRIVATE_GROQ_API_KEY } from '$env/static/private'
import { z } from 'zod'
import type { PageServerLoad } from './$types'
import { createGroq } from '@ai-sdk/groq'
import { generateText, tool } from 'ai'
import { sendMessage } from '$lib/server/telegram'

export const load = (async ({ cookies }) => {
	return {
		color: cookies.get('color'),
	}
}) satisfies PageServerLoad

export const actions = {
	raw: async ({ request }) => {
		const formData = await request.formData()
		const content = formData.get('content') as string

		// const

		const req = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${PRIVATE_GROQ_API_KEY}`,
			},
			body: JSON.stringify({
				model: 'llama-3.2-90b-vision-preview',
				messages: [{ role: 'user', content }],
			}),
		})

		const data = await req.json()

		return {
			response: data.choices[0].message.content,
		}
	},

	sdk: async ({ request, cookies }) => {
		const formData = await request.formData()
		const content = formData.get('content') as string

		const groq = createGroq({
			apiKey: PRIVATE_GROQ_API_KEY,
		})

		const model = groq('llama-3.2-90b-vision-preview')

		const { text } = await generateText({
			model: model,
			prompt: content,
			tools: {
				message_axel: tool({
					description:
						"If the user explicitly asks for it, you can send a message on his behalf to a person named Axel. To do that, user has to provide his own identity (at least his name), and the message he wants to send. You can rephrase it. If you don't know the user name, ask for it first.",
					parameters: z.object({
						sender: z
							.string()
							.describe(
								"The name of the user, so that Axel knows who is sending the message. Ask it if you don't have it.",
							),
						message: z.string().describe('The message to send to Axel.'),
					}),
					execute: async ({ sender, message }) => {
						await sendMessage(undefined, `Message from ${sender}: ${message}`)
						return 'Message sent'
					},
				}),
				set_color: tool({
					description:
						'This is a demo project, and you have a feature called set_color, which let you change the color of a page yourself. Only use if the user asks for it',
					parameters: z.object({
						color: z.string().describe('A CSS color value, like "red" or "#ff0000"'),
					}),
					execute: async ({ color }) => {
						cookies.set('color', color, {
							path: '/',
						})
						return 'Color set'
					},
				}),
			},
			maxSteps: 3,
		})

		return {
			response: text,
		}
	},
}

// const r = await fetch('http://localhost:5174/api/text_axel', {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json',
// 	},
// 	body: JSON.stringify({
// 		message: message,
// 		from: sender,
// 	}),
// })

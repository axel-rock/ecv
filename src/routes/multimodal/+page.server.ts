import { PRIVATE_GROQ_API_KEY } from '$env/static/private'
import { z } from 'zod'
import type { PageServerLoad } from './$types'
import { createGroq } from '@ai-sdk/groq'
import { generateText, tool, type Attachment, type Message } from 'ai'
import { sendMessage } from '$lib/server/telegram'
import fs from 'fs'

export const load = (async ({}) => {}) satisfies PageServerLoad

const toBase64 = async (file: File): Promise<string> => {
	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)
	const base64 = buffer.toString('base64')
	return `data:${file.type};base64,${base64}`
}

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const content = formData.get('content') as string
		const files = formData.getAll('file') as File[]

		files.forEach((file) => console.log(file, typeof file))

		const attachments: Attachment[] = await Promise.all(
			files.map(async (file) => {
				const base64 = await toBase64(file)
				return {
					name: file.name,
					contentType: 'image/png',
					url: base64,
				}
			}),
		)

		console.log('attachments', attachments)

		const message: Message = {
			id: new Date().toTimeString(),
			role: 'user',
			content: content,
			experimental_attachments: attachments,
		}

		console.log('files', message)

		const groq = createGroq({
			apiKey: PRIVATE_GROQ_API_KEY,
		})

		const model = groq('llama-3.2-90b-vision-preview')

		const { text } = await generateText({
			model: model,
			messages: [message],
		})

		return {
			response: text,
		}
	},
}

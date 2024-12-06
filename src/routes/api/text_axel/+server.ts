import { json, text } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { sendMessage } from '$lib/server/telegram'

export const GET: RequestHandler = async () => {
	return new Response()
}

export const POST: RequestHandler = async ({ request }) => {
	const { message, from } = await request.json()
	// await sendMessage(undefined, `Message from ${from}: ${message}`)
	return text('Endpoint deactivated')
}

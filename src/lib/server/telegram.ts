import { PRIVATE_TELEGRAM_ADMIN_CHAT_ID, PRIVATE_TELEGRAM_BOT } from '$env/static/private'

const URL = `https://api.telegram.org/bot${PRIVATE_TELEGRAM_BOT}`

export async function sendMessage(chatId: string = PRIVATE_TELEGRAM_ADMIN_CHAT_ID, text: string) {
	const response = await fetch(`${URL}/sendMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id: chatId,
			text: text,
		}),
	})

	if (!response.ok) {
		console.error('Failed to send message:', await response.text())
	}
}

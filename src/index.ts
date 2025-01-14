import * as dotenv from 'dotenv'
dotenv.config()
import TelegramBot from 'node-telegram-bot-api'
import { startBot } from './commands/start'
import { handlerText } from './handler/text-handler'

const token: string | undefined = process.env.API_KEY_BOT
if (!token) throw new Error('Token please')


export const bot = new TelegramBot(token, {
    polling: true
})
export const commands = [
    {command: "start", description: "Start bot"}
]
export const gptNames = ['GPT4o-mini', 'GPT-3.5-turbo', 'GPT-3.5-turbo-16k']
// STATES
export const userGptReadyState: {[key: number]: string} = {}
export const gptAnswerReadyState: {[key: number]: {gptVersion: string, state: string}} = {}

bot.setMyCommands(commands)

bot.onText(/\/start/, startBot)
bot.on('text', handlerText)
import * as dotenv from 'dotenv'
dotenv.config()
import TelegramBot from 'node-telegram-bot-api'
import { startBot } from './commands/start'
import { handlerText } from './handler/text-handler'

process.env.NTBA_FIX_350 = '1' // REMOVES WARNING WHEN SENDING AN IMAGE

const token: string | undefined = process.env.API_KEY_BOT
if (!token) throw new Error('Token please')


export const bot = new TelegramBot(token, {
    polling: true
})
export const commands = [
    { command: "start", description: "Start bot" }
]
export const stores = ['Wildberries', 'Ozon', 'Amazon']
// STATES
export const readyState: { [key: number]: string } = {}

bot.setMyCommands(commands)

bot.onText(/\/start/, startBot)
bot.on('text', handlerText)
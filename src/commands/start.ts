import TelegramBot from "node-telegram-bot-api"
import { constantBtn } from "../components/constBtn"

export async function startBot(msg: TelegramBot.Message) {

    const text = `This bot will help you analyze reviews of any products in wildberries, ozon and amazon stores`

    await constantBtn(msg, text)
}
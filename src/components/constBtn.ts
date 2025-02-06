import TelegramBot from "node-telegram-bot-api";
import { bot, stores } from "..";

export async function constantBtn(msg: TelegramBot.Message, text: string) {
    await bot.sendMessage(msg.from?.id as number, text, {
        parse_mode: "HTML",
        reply_markup: {
            keyboard: [
                [{text: stores[0]}, {text: stores[1]}],
                [{text: stores[2]}],
            ],
            resize_keyboard: true
        }
    })
}
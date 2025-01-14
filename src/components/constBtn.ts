import TelegramBot from "node-telegram-bot-api";
import { bot, gptNames } from "..";

export async function constantBtn(msg: TelegramBot.Message, text: string) {
    await bot.sendMessage(msg.chat.id, text, {
        parse_mode: "HTML",
        reply_markup: {
            keyboard: [
                [{text: gptNames[1]}, {text: gptNames[2]}],
                [{text: gptNames[0]}]
            ],
            resize_keyboard: true
        }
    })
}
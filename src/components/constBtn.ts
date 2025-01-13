import TelegramBot from "node-telegram-bot-api";
import { bot, gptNames, userGptReadyState } from "..";

export async function constantBtn(msg: TelegramBot.Message, text: string) {
    await bot.sendMessage(msg.chat.id, text, {
        parse_mode: "HTML",
        reply_markup: {
            keyboard: [
                [{text: gptNames[0]}, {text: gptNames[1]}]
            ],
            resize_keyboard: true
        }
    })
}
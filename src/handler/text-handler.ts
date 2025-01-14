import TelegramBot from "node-telegram-bot-api";
import { bot, gptNames, gptAnswerReadyState, userGptReadyState } from "..";
import { gpt4oMini } from "../components/gpt40-mini";
import { constantBtn } from "../components/constBtn";
import { gpt35Turbo } from "../components/gpt-3.5-turbo";
import { gpt35Turbo16k } from "../components/gpt35Turbo16";

export async function handlerText(msg: TelegramBot.Message) {
    try {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === 'Назад') {
            gptAnswerReadyState[chatId] = { gptVersion: '', state: "" }
            await constantBtn(msg, 'Выбери версию GPT')
            return
        }
        else if (text && gptNames.includes(text)) {
            await bot.sendMessage(chatId, 'Отправь свой вопрос:', {
                reply_markup: {
                    keyboard: [[{ text: 'Назад' }]],
                    resize_keyboard: true
                }
            })
            gptAnswerReadyState[chatId] = { state: 'ready', gptVersion: text }
            return
        }

        else if (text && gptAnswerReadyState[chatId]?.state) {
            switch (gptAnswerReadyState[chatId].gptVersion) {
                case gptNames[0]: {
                    await gpt4oMini(msg)
                    return
                }
                case gptNames[1]: {
                    await gpt35Turbo(msg)
                    return
                }
                case gptNames[2]: {
                    await gpt35Turbo16k(msg)
                    return
                }
            }
        }else{
            await bot.deleteMessage(msg.chat.id, msg.message_id)
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Server error 😢')
        }
    }
}
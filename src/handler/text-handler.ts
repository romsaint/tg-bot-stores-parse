import TelegramBot from "node-telegram-bot-api";
import { bot, gptNames, gptAnswerReadyState, userGptReadyState } from "..";
import { gpt4oMini } from "../components/gpt40-mini";
import { constantBtn } from "../components/constBtn";
import { gpt35Turbo } from "../components/gpt-3.5-turbo";

export async function handlerText(msg: TelegramBot.Message) {
    const text = msg.text
    const chatId = msg.chat.id
    if(text === 'Назад' && gptAnswerReadyState[chatId]?.state) {
        gptAnswerReadyState[chatId] = {gptVersion: '', state: ""}
        await constantBtn(msg, 'Выбери версию GPT')
        return
    }
    if(text && gptNames.includes(text)) {
        await bot.sendMessage(chatId, 'Отправь свой вопрос:', {
            reply_markup: {
                keyboard: [[{text: 'Назад'}]],
                resize_keyboard: true
            }
        })
        gptAnswerReadyState[chatId] = {state: 'ready', gptVersion: text}
        return
    }
 
    if(text && gptAnswerReadyState[chatId]?.state) {
        switch(gptAnswerReadyState[chatId].gptVersion) {
            case gptNames[0]: {
                await gpt4oMini(msg)
                return
            }
            case gptNames[1]: {
                await gpt35Turbo(msg)
                return
            }
        }
    }
}
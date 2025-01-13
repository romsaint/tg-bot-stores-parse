import TelegramBot from "node-telegram-bot-api";
import { bot } from "..";
const OpenAI = require("openai");


export async function gpt35Turbo(msg: TelegramBot.Message) {
    const chatId = msg.chat.id
    const openai = new OpenAI({
        apiKey: "RuXzfEo3ThsIZ6hyC00aBb51C24e49669e0aB9A02847Ed61", // Ваш API-ключ
        baseURL: "https://free.v36.cm/v1" // Указание кастомного URL
    });
  
    await bot.sendChatAction(msg.chat.id, 'typing')
    const message = await bot.sendMessage(chatId, 'Подождите...')
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Модель
        messages: [{ role: "user", content: msg.text }], // Сообщения
    });

    await bot.editMessageText(chatCompletion.choices[0].message.content, {
        chat_id: chatId, 
        message_id: message.message_id
    })
}
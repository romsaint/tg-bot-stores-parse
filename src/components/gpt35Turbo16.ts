import TelegramBot from "node-telegram-bot-api";
import { bot } from "..";
const OpenAI = require("openai");


export async function gpt35Turbo16k(promt: string) {
    try {
        const openai = new OpenAI({
            apiKey: "RuXzfEo3ThsIZ6hyC00aBb51C24e49669e0aB9A02847Ed61", // Ваш API-ключ
            baseURL: "https://free.v36.cm/v1" // Указание кастомного URL
        });

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k", // Модель
            messages: [{ role: "user", content: promt }], // Сообщения
        });


        return chatCompletion.choices[0].message.content
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
        }
    }
}
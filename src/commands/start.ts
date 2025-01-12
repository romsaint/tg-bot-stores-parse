import TelegramBot from "node-telegram-bot-api"
import { bot, userGptReadyState } from ".."
import { constantBtn } from "../components/constBtn"

export async function startBot(msg: TelegramBot.Message) {

    const text = `Это ChatGtp бот, который работает <b>БЕСПЛАТНО!</b>\nПросто выбери модель, затем задай вопрос и все! Бот в <b>течение пары секунд</b> выдаст тебе ответ.`
    const apiUrl = 'https://free.v36.cm/api/data'; // Замените на реальный endpoint
    const secretKey = 'RuXzfEo3ThsIZ6hyC00aBb51C24e49669e0aB9A02847Ed61';

    await constantBtn(msg, text)
}
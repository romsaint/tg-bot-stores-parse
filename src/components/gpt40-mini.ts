import TelegramBot from "node-telegram-bot-api";
import { bot, userGptReadyState } from "..";
import axios from "axios";


export async function gpt4oMini(msg: TelegramBot.Message) {
    try {
        const text = msg.text
        const chatId = msg.chat.id

        const responseTranslate = await axios(`https://ftapi.pythonanywhere.com/translate?sl=ru&dl=en&text=${text}`);
        await bot.sendChatAction(chatId, 'typing')

        const trans = responseTranslate.data['destination-text']
        const responseOnEn = await axios.get(`https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${trans}`)
        const responseOnRu = await axios(`https://ftapi.pythonanywhere.com/translate?sl=en&dl=ru&text=${responseOnEn.data.results}`);

      
        await bot.sendMessage(chatId, responseOnRu.data['destination-text'])
    } catch (e) {
        if (e instanceof Error) console.log(e.message)
    }
}
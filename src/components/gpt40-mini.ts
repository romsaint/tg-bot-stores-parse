import TelegramBot from "node-telegram-bot-api";
import { bot, userGptReadyState } from "..";
import axios from "axios";


export async function gpt4oMini(msg: TelegramBot.Message) {
    try {
        const text = msg.text
        const chatId = msg.chat.id
      
        await bot.sendChatAction(chatId, 'typing')
        const message = await bot.sendMessage(chatId, 'Подождите...')
        const responseTranslate = await axios(`https://ftapi.pythonanywhere.com/translate?sl=ru&dl=en&text=${text}`);

        const trans = responseTranslate.data['destination-text']
        const responseOnEn = await axios.get(`https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${trans}`)
        const responseOnRu = await axios(`https://ftapi.pythonanywhere.com/translate?sl=en&dl=ru&text=${responseOnEn.data.results}`);

        await bot.editMessageText(responseOnRu.data['destination-text'], {
            chat_id: chatId, 
            message_id: message.message_id
        })
    } catch (e) {
        if (e instanceof Error) console.log(e.message)
    }
}
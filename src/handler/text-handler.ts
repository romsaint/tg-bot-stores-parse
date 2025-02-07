import TelegramBot from "node-telegram-bot-api";
import { bot, readyState, stores } from "..";
import { parseWb } from "../components/stores/wb/parsing/parseWb";
import { createReadStream } from "fs";
import path from "path";
import { unlink } from "fs/promises";


export async function handlerText(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id
        const text = msg.text

        if (userId && text) {
            if (readyState[userId] === stores[0]) {
                    await bot.sendChatAction(userId, 'upload_document')
                    const message = await bot.sendMessage(userId, 'Wait...')
                    const file = await parseWb(text)
                    
                    if (file) {
                        const filepath = path.join(__dirname, '../../', file)
                        const stream = createReadStream(filepath)
                   
                        await bot.sendDocument(userId, stream)
                        await bot.deleteMessage(userId, message.message_id)
                        await unlink(filepath)
                        return
                    }else{
                        await bot.deleteMessage(userId, message.message_id)
                        await bot.sendMessage(userId, 'Wrong url')
                        return
                    }
            }

            else if (text === stores[0]) {
                await bot.sendMessage(userId, 'Send product card url(e.g https://www.wildberries.ru/catalog/226791823/detail.aspx)', {
                    parse_mode: 'HTML'
                })
                readyState[userId] = stores[0]
            }
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            await bot.sendMessage(msg.chat.id, 'Server error 😢')
        }
    }
}
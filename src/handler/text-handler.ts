import TelegramBot from "node-telegram-bot-api";
import { bot, readyState, stores } from "..";
import { parseWb } from "../components/stores/wb/parsing/parseWb";
import { createReadStream, existsSync } from "fs";
import path from "path";
import { constantBtn } from "../components/constBtn";
import { startBot } from "../commands/start";


export async function handlerText(msg: TelegramBot.Message) {
    try {
        const userId = msg.from?.id
        const text = msg.text

        if (userId && text) {
            if (readyState[userId] === stores[0]) {
              
                    await bot.sendChatAction(userId, 'upload_document')
                    const file = await parseWb(text)
                    
                    if (file) {
                        const filepath = path.join(__dirname, '../../', file)
                        const stream = createReadStream(filepath)
                   
                        await bot.sendDocument(userId, stream)
                        return
                    }else{
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
import { gpt35Turbo16k } from "../../../gpt35Turbo16";
import { parseCardWb, parseWbFeedbacks, parseWbPhoto, parseWbPriceHistory } from "../parseWb";
import { saveCardToExcel } from "../save/saveCard";

const puppeteer = require('puppeteer');

export async function parseWb(url: string) {
    try {
        if (url.endsWith('detail.aspx')) {
            const browser = await puppeteer.launch(); // headless: false чтобы видеть действия в браузере
            const page = await browser.newPage();

            // Переходим на страницу
            await page.goto(url);

            // Открываем инструменты разработчика (F12)
            await page.keyboard.press('F12');

            // Используем Promise для ожидания результата
            const cardUrl = await new Promise<string>(async (resolve) => {
                setTimeout(async () => {
                    const cardUrl = await page.evaluate(() => {
                        const requests = performance.getEntriesByType('resource');
                        const cardRequest = requests.find(request => request.name.includes('card.json'));
                        return cardRequest ? cardRequest.name : null;
                    });
                    resolve(cardUrl);
                }, 2000);
            });
            
            await browser.close();

            if (!cardUrl) {
                throw new Error('Не удалось получить URL карточки.');
            }

            const cardUrlArr = cardUrl.split('/info/ru/card.json').join('').split('/');
            const cardId = cardUrlArr[cardUrlArr.length - 1];

            const cardIdMid = cardId.slice(0, cardId.length - 3);
            const cardIdMini = cardId.slice(0, cardId.length - 5);

            // DATA
            let cardData = await parseCardWb(cardUrl);
            let feedbacksData = await parseWbFeedbacks(cardData.imt_id);

            let feedbacksDataStr: string = feedbacksData.feedbacks.map((val: any) => val.text).join('--')
            let gptOpinion
            if(feedbacksDataStr.length > 20) {
                const promt = `
                На основе представленных отзывов составь профессиональное мнение о товаре. Определи его основные плюсы и минусы, обрати внимание на частоту повторения схожих мнений. Раздели анализ на несколько частей:1. Общее впечатление — какой образ товара формируется из отзывов? Насколько пользователи довольны покупкой?2. Преимущества — перечисли основные плюсы, которые чаще всего упоминаются.3. Недостатки — выдели ключевые минусы, если они есть, и оцени их серьёзность.4. Заключение — сделай краткий вывод: для кого этот товар подойдёт, стоит ли его покупать, оправдывает ли он свою цену?Отзывы: ${feedbacksDataStr} Сформулируй ответ объективно и профессионально, избегая субъективных оценок. Основания для выводов должны быть чётко связаны с отзывами."
                `
                gptOpinion = await gpt35Turbo16k(promt)
    
            }
            
            let priceHistoryData = await parseWbPriceHistory(cardUrl, cardIdMini, cardIdMid, cardId);
            const buffers = await parseWbPhoto(cardUrl, cardData.media?.photo_count);

            // SAVE EXCEL
            const fileName = await saveCardToExcel(cardData, priceHistoryData, feedbacksData, buffers, gptOpinion); // 139089078.xlsx
   
            return fileName;

        } else {
            return null;
        }
    } catch (e) {
        console.error('Ошибка при парсинге:', e);
        return null;
    }
}
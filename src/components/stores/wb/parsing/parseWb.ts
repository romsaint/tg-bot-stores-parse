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
            let priceHistoryData = await parseWbPriceHistory(cardUrl, cardIdMini, cardIdMid, cardId);
            const buffers = await parseWbPhoto(cardUrl, cardData.media?.photo_count);

            // SAVE EXCEL
            const fileName = await saveCardToExcel(cardData, priceHistoryData, feedbacksData, buffers); // 139089078.xlsx
   
            return fileName;

        } else {
            return null;
        }
    } catch (e) {
        console.error('Ошибка при парсинге:', e);
        return null;
    }
}
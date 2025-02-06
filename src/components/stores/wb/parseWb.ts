import axios from "axios"

export async function parseCardWb(url: string) {
    try {
        const data = (await axios.get(url)).data
        
        return data
    } catch (e) {
        return null
    }
}
export async function parseWbFeedbacks(fullId: string) {
    try {
        let feedbacksUrl = `https://feedbacks2.wb.ru/feedbacks/v2/${fullId}`

        let data = (await axios.get(feedbacksUrl)).data
        if (data.feedbackCount === 0) {
            feedbacksUrl = `https://feedbacks1.wb.ru/feedbacks/v2/${fullId}`

            data = (await axios.get(feedbacksUrl)).data
            return data
        }
        return data
    } catch (e) {
        return null
    }
}
export async function parseWbPriceHistory(url: string, card4: string, card6: string, fullId: string) {
    try {
        let firstPart = url.split('/').slice(0, 3).join('/')
        let secondPart = url.split('/').slice(6, 7).join('/')
        const res = firstPart + `/vol${card4}/part${card6}/${fullId}/` + secondPart + '/price-history.json'
      
        const data = (await axios.get(res)).data

        return data
    } catch (e) {
        return null
    }
}

export async function parseWbPhoto(url: string, count: number) {
    const urls = []
    if(count) {
        for(let i = 1; i <= count; i++) {
            const imageUrl = url.split('info/ru/card.json').join('') + `images/big/${i}.webp`

            urls.push(imageUrl)
        }

        return urls
    }

    return null
}
import ExcelJS from 'exceljs'
import { createWriteStream } from 'fs';
import PDF from 'pdfkit'


function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000); // Умножаем на 1000, так как timestamp в секундах
    return date.toLocaleDateString('ru-RU'); // Форматируем дату в формате "дд.мм.гггг"
}
function numberToARGB(number: number) {
    return number.toString(16).padStart(8, '0').toUpperCase();
}

export async function saveCardToExcel(data: any, priceHistoryData: any, feedbacksData: any, urls: string[] | null, gptOpinion: string | undefined, sameProducts: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet');
    const rows: string[] = ['Название', 'Описание', 'Раздел', 'Продавец', 'Цвет']
    const optionsValues: any[] = []


    for (const i of data.options) {
        if (i.name !== 'Цвет') {
            rows.push(i.name)
            optionsValues.push(i.value)
        }

    }

    worksheet.addRow(rows)
    const dataRow = [
        data.imt_name,
        data.description,
        data.subj_root_name,
        data.selling.brand_name,
        data.nm_colors_names ? data.nm_colors_names : data.colors ? data.colors.map((val: any) => numberToARGB(val)).join(', ') : '',
        ...optionsValues
    ];
    worksheet.addRow(dataRow);

    if (urls) {
        worksheet.addRow([''])
        worksheet.mergeCells('A4:B4')
        worksheet.getCell('A4').value = 'Изображения'
        worksheet.getCell('A4').fill = {
            type: 'pattern',
            pattern: 'solid',
            bgColor: { argb: "FF85B8FF" }
        };

        worksheet.addRow(urls)
    }

    const priceData = priceHistoryData.map((val: any) => {
        return [formatDate(val.dt), val.price.RUB / 100]
    })
    worksheet.mergeCells('B8:G8')

    worksheet.getCell('D8').value = `Таблица цен с ${priceData[0][0]} по ${priceData[priceData.length - 1][0]}`
    worksheet.getCell('D8').alignment = { vertical: "middle", horizontal: 'center' }

    worksheet.addTable({
        name: 'PriceTable',
        headerRow: true,
        totalsRow: false,
        ref: 'D9',
        style: {
            theme: 'TableStyleMedium2',
            showRowStripes: true
        },
        columns: [
            { name: 'Дата', filterButton: true },
            { name: 'Цена', filterButton: true }
        ],
        rows: priceData
    });

    worksheet.addRow([])
    worksheet.addRow([])
    const text = worksheet.addRow(['Отзывы'])

    text.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF85B8FF' } // Заливка для первого столбца
    };


    text.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF85B8FF' } // Заливка для второго столбца
    };

    const startCol = 1; // Первый столбец (A)
    const endCol = 2;   // Второй столбец (B)
    const rowNumber = text.number; // Номер строки, в которой находится текст

    worksheet.mergeCells(rowNumber, startCol, rowNumber, endCol);

    const valuation = worksheet.addRow(['Оценка'])

    valuation.getCell(2).value = feedbacksData.valuation

    worksheet.addRow(['Текст', 'Достоинства', 'Недостатки'])
    feedbacksData.feedbacks.forEach((val: any) => {
        let res: string | number[] = [val.text ? val.text : '', val.pros ? val.pros : '', val.cons ? val.cons : '',]
        if (res.join('').length > 0) {
            worksheet.addRow(res)
        }
    })

    if (gptOpinion) {
        worksheet.getCell('I8').value = 'Мнение нейросети судя по отзывам'
        worksheet.getCell('I9').value = gptOpinion
    }

    worksheet.getCell('K8').value = 'Похожие товары'
    worksheet.getCell('K9').value = sameProducts

    await workbook.xlsx.writeFile(`${data.nm_id}.xlsx`)

    // PDF
    const doc = new PDF()
    const stream = createWriteStream('./output.pdf')
    doc.pipe(stream)
    doc.font('fonts/Roboto-VariableFont_wdth,wght.ttf')


    for (let j = 0; j < dataRow.length; j++) {
        doc.fontSize(12).text(`${rows[j]}: ${dataRow[j]}`)
    }
    console.log(priceData)
    doc.fontSize(16).text(`Таблица цен с ${priceData[0][0]} по ${priceData[priceData.length - 1][0]}`)

    for (let j = 0; j < priceData.length; j++) {
        doc.fontSize(12).text(`${priceData[j][0]}: ${priceData[j][1]}`)
    }

    doc.end()
    stream.on('finish', () => {
        console.log('PDF создан: output.pdf');
    });

    return `${data.nm_id}.xlsx`
}
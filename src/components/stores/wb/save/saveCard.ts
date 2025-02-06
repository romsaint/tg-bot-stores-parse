import ExcelJS from 'exceljs'


function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000); // Умножаем на 1000, так как timestamp в секундах
    return date.toLocaleDateString('ru-RU'); // Форматируем дату в формате "дд.мм.гггг"
}
function numberToARGB(number: number) {
    return number.toString(16).padStart(8, '0').toUpperCase();
}

export async function saveCardToExcel(data: any, priceHistoryData: any, feedbacksData: any, urls: string[] | null) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
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
        if(res.join('').length > 0) {
            worksheet.addRow(res)
        }
    })

    await workbook.xlsx.writeFile(`${data.nm_id}.xlsx`)

    return `${data.nm_id}.xlsx`
}
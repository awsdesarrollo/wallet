import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'fs';

export const CreateExcel = ({ filename, sheet, data, totals, template, path }): Promise<string> => {
    return new Promise((resolve) => {
        if (data.length <= 0) resolve(null);

        const rows = data.map(doc => Object.values(doc));
        const keys = Object.keys(data[0]);

        const book = new Workbook();
        const addSheet = book.addWorksheet(sheet);

        switch (template) {
            case 'orderReport':
                orderReports(addSheet,rows,keys,book,data,totals);
                break;
            default:
                none(addSheet, rows, keys);
                break;
        }

        const FILE = `excel/${filename}.xlsx`;
        const URL_PATH = `public/storage/${FILE}`;
        if (fs.existsSync(path)) book.xlsx.writeFile(URL_PATH);
        else {
            fs.mkdirSync(`public/storage/excel`, { recursive: true });
            book.xlsx.writeFile(URL_PATH);
        }
        const debounce = setTimeout(() => {
            clearTimeout(debounce);
            resolve(FILE);
        }, 1000);
    });
}

const orderReports = (
    addSheet: Worksheet,
    rows: any[],
    keys: string[],
    workbook: Workbook,
    data: any,
    totals: any[]
) => {

    ['B2','E2'].map((key, index, self) => {
        const cell = addSheet.getCell(key);
        cell.value = Object.keys(totals[0])[index];
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DDEBF7' },
            bgColor: { argb: 'DDEBF7' }
        };
        cell.font = { bold: true, size: 12, color: { argb: '000000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
        }
    })

    let initCell = 2;

    addSheet.mergeCells(`B${initCell}:D${initCell}`)
    addSheet.mergeCells(`E${initCell}:G${initCell}`)

    initCell += 1;

    totals.map((item, rowIndex) => {
        const setCell = [`B${initCell}`, `E${initCell}`];
        setCell.map((key, index, self) => {
            const cell = addSheet.getCell(key);
            cell.value = Object.values(totals[rowIndex])[index] as any;
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
            }
        });
        addSheet.mergeCells(`B${initCell}:D${initCell}`);
        addSheet.mergeCells(`E${initCell}:G${initCell}`);

        initCell += 1;
    });

    initCell += 2;

    [`B${initCell}`,`D${initCell}`,`F${initCell}`,`I${initCell}`,`L${initCell}`,`N${initCell}`,`Q${initCell}`,`S${initCell}`,`V${initCell}`].map((key, index, self) => {
        const cell = addSheet.getCell(key);
        cell.value = keys[index];
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DDEBF7' },
            bgColor: { argb: 'DDEBF7' }
        };
        cell.font = { bold: true, size: 12, color: { argb: '000000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
        }
    })

    addSheet.mergeCells(`B${initCell}:C${initCell}`);
    addSheet.mergeCells(`D${initCell}:E${initCell}`);
    addSheet.mergeCells(`F${initCell}:H${initCell}`)
    addSheet.mergeCells(`I${initCell}:K${initCell}`)
    addSheet.mergeCells(`L${initCell}:M${initCell}`)
    addSheet.mergeCells(`N${initCell}:P${initCell}`)
    addSheet.mergeCells(`Q${initCell}:R${initCell}`)
    addSheet.mergeCells(`S${initCell}:U${initCell}`)
    addSheet.mergeCells(`V${initCell}:W${initCell}`)

    initCell += 1;

    rows.map((item, rowIndex) => {
        const setCell = [
            `B${initCell}`, `D${initCell}`, `F${initCell}`, `I${initCell}`,
            `L${initCell}`, `N${initCell}`, `Q${initCell}`, `S${initCell}`, `V${initCell}`
        ];
        setCell.map((key, index, self) => {
            const cell = addSheet.getCell(key);
            cell.value = rows[rowIndex][index];
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
            }
        });
        addSheet.mergeCells(`B${initCell}:C${initCell}`);
        addSheet.mergeCells(`D${initCell}:E${initCell}`);
        addSheet.mergeCells(`F${initCell}:H${initCell}`);
        addSheet.mergeCells(`I${initCell}:K${initCell}`);
        addSheet.mergeCells(`L${initCell}:M${initCell}`);
        addSheet.mergeCells(`N${initCell}:P${initCell}`);
        addSheet.mergeCells(`Q${initCell}:R${initCell}`);
        addSheet.mergeCells(`S${initCell}:U${initCell}`);
        addSheet.mergeCells(`V${initCell}:W${initCell}`);

        initCell += 1;
    });
}

const none = (addSheet: Worksheet, rows: any[], keys: string[]) => {

    rows.unshift(keys);
    addSheet.addRows(rows);

    for (let index = 1; index <= keys.length; index++) {
        addSheet.getColumn(index).width = 25;
    }
    addSheet.getRow(1).font = { size: 11.5, bold: true, color: { argb: 'FFFFFF' } };
    addSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid' }
    addSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    addSheet.getRow(1).border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: 'FFFFFF' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
}
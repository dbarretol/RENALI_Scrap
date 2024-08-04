const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Definición de las rutas de los archivos
const basePath = path.join(__dirname, '..', 'data', 'Items_urlList');
const outputDir = path.join(__dirname, '..', 'data', 'ItemsDB');

// Definición de los archivos de entrada y salida
const inputFiles = [
    {input: 'ALICIA_consolidado.txt', output: 'ALICIA_ItemsInfo.json', type: 'alicia'},
    {input: 'RENATI_consolidado.txt', output: 'RENATI_ItemsInfo.json', type: 'renati'}
];

// Función de scraping para ALICIA
async function scrapeAlicia(page) {
    return await page.evaluate(() => {
        let title = document.querySelector('h1[property="name"]').innerText;
        let metadata = { 'Título:': title, 'URL:': window.location.href };

        let table = document.querySelector('tbody');
        let rows = Array.from(table.querySelectorAll('tr'));

        rows.forEach(row => {
            let label = row.querySelector('th').innerText.trim();

            if (label === 'Autores:') {
                let authors = Array.from(row.querySelectorAll('a')).map(a => a.innerText.trim());
                metadata['Autor:'] = authors.join(';');
            } else {
                let value = row.querySelector('td').innerText.trim();
                metadata[label] = value;
            }
        });

        return metadata;
    });
}

// Función de scraping para RENATI
async function scrapeRenati(page) {
    return await page.evaluate(() => {
        let metadata = {};
        const metadataFields = document.querySelectorAll('.metadataField');
        metadataFields.forEach(field => {
            const label = field.querySelector('.metadataFieldLabel').innerText.trim();
            const value = field.querySelector('.metadataFieldValue').innerText.trim();
            metadata[label] = value;
        });
        return metadata;
    });
}

// Función principal para realizar el scraping
async function main() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const {input, output, type} of inputFiles) {
        const inputFilePath = path.join(basePath, input);
        const outputFilePath = path.join(outputDir, output);

        const urls = fs.readFileSync(inputFilePath, 'utf-8').split('\n').filter(url => url);
        const results = [];

        for (let url of urls) {
            console.log(`Visitando la url: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2' });

            let data;
            if (type === 'alicia') {
                data = await scrapeAlicia(page);
            } else if (type === 'renati') {
                data = await scrapeRenati(page);
            }

            results.push(data);
        }

        fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2), 'utf-8');
    }

    await browser.close();
}

main().catch(console.error);
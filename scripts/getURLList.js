const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

// Definir los archivos de entrada y salida
const inputs = [
    {input: 'ALICIA - SL - {offshore}.txt', output: 'ALICIA-ItemUrlList-{offshore}.txt', base: '/vufind/Record/'},
    {input: 'RENATI - SL - {offshore}.txt', output: 'RENATI-ItemUrlList-{offshore}.txt', base: '/handle/sunedu/'},
    {input: 'ALICIA - SL - {costa afuera}.txt', output: 'ALICIA-ItemUrlList-{costa afuera}.txt', base: '/vufind/Record/'},
    {input: 'RENATI - SL - {costa afuera}.txt', output: 'RENATI-ItemUrlList-{costa afuera}.txt', base: '/handle/sunedu/'}
];

const rawUrlsDir = path.join(__dirname, '..', 'data', 'RawURLS');
const outputDir = path.join(__dirname, '..', 'data', 'Items_urlList','base');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const {input, output, base} of inputs) {
        const inputFilePath = path.join(rawUrlsDir, input);
        const outputFilePath = path.join(outputDir, output);

        // Leer los enlaces y guardarlos en una variable
        const data = fs.readFileSync(inputFilePath, 'utf8');
        const urls = data.split('\n').filter(url => url);

        let results = [];

        for (let url of urls) {
            // Visitar enlace por enlace y esperar hasta que la página cargue completamente
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Capturar todos los elementos con tag 'a' y cuyo href inicie con la base correspondiente
            const links = await page.$$eval(`a[href^="${base}"]`, as => as.map(a => a.href.replace('/Save', '')));

            // Eliminar elementos repetidos
            const uniqueLinks = [...new Set(links)];

            // Guardar cada url original y las href correspondientes obtenidas en un formato específico
            uniqueLinks.forEach(link => {
                results.push(`${url.trim()}\t${link.trim()}`);
            });
        }

        // Guardar las URLs en un archivo txt
        fs.writeFileSync(outputFilePath, results.join('\n'));
    }

    await browser.close();
})();
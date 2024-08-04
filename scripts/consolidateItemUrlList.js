const fs = require('fs');
const path = require('path');

// Función para leer un archivo y extraer las URLs
function readAndExtractUrls(filePath) {
    return fs.readFileSync(filePath, 'utf-8')
             .split('\n')
             .filter(line => line.trim())
             .map(line => line.split('\t')[1]);
}

// Función para unir dos listas de URLs y eliminar duplicados
function consolidateUrls(...urlLists) {
    return [...new Set(urlLists.flat())];
}

// Función para guardar las URLs en un archivo
function saveUrls(urls, filePath) {
    fs.writeFileSync(filePath, urls.join('\n'), 'utf-8');
}

// Función para procesar dos archivos y guardar los resultados en un archivo de salida
function processFiles(basePath, file1, file2, outputFile) {
    const urls1 = readAndExtractUrls(path.join(basePath, file1));
    const urls2 = readAndExtractUrls(path.join(basePath, file2));
    const allUrls = consolidateUrls(urls1, urls2);
    saveUrls(allUrls, path.join(outputDir, outputFile));
}

// Definir rutas base
const basePath = path.join(__dirname, '..', 'data', 'Items_urlList','base');
const outputDir = path.join(__dirname, '..', 'data', 'Items_urlList');

// Procesar los archivos ALICIA
processFiles(basePath, 'ALICIA-ItemUrlList-{costa afuera}.txt', 'ALICIA-ItemUrlList-{offshore}.txt', 'ALICIA_consolidado.txt');

// Procesar los archivos RENATI
processFiles(basePath, 'RENATI-ItemUrlList-{costa afuera}.txt', 'RENATI-ItemUrlList-{offshore}.txt', 'RENATI_consolidado.txt');
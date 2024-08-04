# RENALI_scrap

Este repositorio contiene scripts en JavaScript y Python diseñados para extraer y procesar información de los repositorios ALICIA y RENATI, con el objetivo de realizar análisis de antecedentes. Los scripts de JavaScript se encargan de la recolección de datos, mientras que el script de Python se encarga del post-procesamiento de la información recolectada.

## Estructura del Repositorio

### Carpetas

- **`data/`**: Contiene los datos recolectados y procesados.
  - **`RawURLS/`**: Almacena las URLs de búsqueda inicial para ALICIA y RENATI. Debes visitar los repositorios, realizar búsquedas con palabras clave y guardar las URLs de todas las páginas de resultados en archivos `.txt`.
  - **`Items_urlList/`**: Contiene los enlaces a todos los ítems recolectados. Se llena automáticamente al ejecutar `getURLList.js` y `consolidateItemUrlList.js`.
  - **`ItemsDB/`**: Almacena los datos de los ítems en formato JSON después de ejecutar `scrapItemsInfo.js`.
  - **`ScrapedLists/`**: Guarda los resultados del web scraping y el post-procesamiento en formato XLSX, con identificadores únicos para facilitar la detección de duplicados.

## Descripción de Scripts

- **`scripts/getURLList.js`**: Este script extrae los enlaces de cada ítem individual de las páginas de búsqueda y guarda los resultados en `data/Items_urlList/base`.
  
- **`scripts/consolidateItemUrlList.js`**: Consolida todos los enlaces en un único archivo. Esto es útil cuando se han generado múltiples archivos de resultados por cada repositorio.

- **`scripts/scrapItemsInfo.js`**: Extrae información detallada de los ítems desde las URLs en `data/Items_urlList` y guarda los metadatos en archivos JSON en `data/ItemsDB`.

- **`scripts/postProcRegisters.py`**: Reordena las columnas y genera identificadores únicos para títulos, autores y combinaciones de estos, guardando los resultados en `data/ScrapedLists` en formato XLSX.

## Uso

### Dependencias

Asegúrate de tener instaladas las siguientes dependencias:

- **Para los scripts de JavaScript**:
  - `puppeteer`: Para la navegación y extracción de datos web.
  - `fs`: Para la manipulación de archivos.

  Instala estas dependencias ejecutando:
  ```bash
  npm install puppeteer fs
  ```

- **Para el script de Python**:
  - `pandas`, `hashlib`, `re`, `os`

  Puedes instalar las librerías necesarias usando pip:
  ```bash
  pip install pandas
  ```

### Configuración

Los scripts están configurados para realizar búsquedas específicas con los términos 'offshore' y 'costa afuera' en los repositorios de RENATI y ALICIA. Para buscar otros términos, modifica los nombres de los archivos en `RawURLS/` y actualiza los scripts en consecuencia.

### Ejecución de los Scripts

Sigue estos pasos para ejecutar los scripts en el orden correcto:

1. Ejecuta `getURLList.js`:
   ```bash
   node ./scripts/getURLList.js
   ```

2. Ejecuta `consolidateItemUrlList.js`:
   ```bash
   node ./scripts/consolidateItemUrlList.js
   ```

3. Ejecuta `scrapItemsInfo.js`:
   ```bash
   node ./scripts/scrapItemsInfo.js
   ```

4. Ejecuta `postProcRegisters.py`:
   ```bash
   python ./scripts/postProcRegisters.py
   ```

## Contribuciones

Si deseas contribuir a este proyecto, por favor sigue estas directrices:
- Realiza un fork del repositorio.
- Crea una nueva rama para tu contribución.
- Envía un pull request describiendo tus cambios.

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## Contacto

Para preguntas o sugerencias, por favor contacta a [tu correo electrónico](mailto:dbarretol@outlook.com).
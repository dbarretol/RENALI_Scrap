#%% Importando librerías
import pandas as pd
import hashlib
import re
import os

#%% Variables globales
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
list1 = os.path.join(base_dir, 'data', 'ItemsDB', 'ALICIA_ItemsInfo.json')
list2 = os.path.join(base_dir, 'data', 'ItemsDB', 'RENATI_ItemsInfo.json')
output_dir = os.path.join(base_dir, 'data', 'ScrapedLists')

#%% Definición de funciones
def normalize_string(s):
    return re.sub(r'\W+', '', s).lower()

def normalize_title(title):
    return normalize_string(title)

def normalize_authors(authors):
    author_list = sorted([normalize_string(author) for author in authors.split(';')])
    return ';'.join(author_list)

def generate_unique_id(title, authors):
    normalized_title = normalize_title(title)
    normalized_authors = normalize_authors(authors)
    
    title_id = hashlib.md5(normalized_title.encode()).hexdigest()
    authors_id = hashlib.md5(normalized_authors.encode()).hexdigest()
    combined_string = normalized_title + '|' + normalized_authors
    
    unique_id = hashlib.md5(combined_string.encode()).hexdigest()
    return title_id, authors_id, unique_id

#%% Programa principal

# Cargando datos
A_records = pd.read_json(list1)
R_records = pd.read_json(list2)

# Reorganizando columnas
col_ord1 = ['URL:','Enlace del recurso:','Formato:',
            'Repositorio:','Institución:','Título:',
            'Autor:','Fecha de Publicación:',
            'Lenguaje:','OAI Identifier:','Nivel de acceso:','Materia:']
col_ord2 = ['Enlace al repositorio:','Aparece en las colecciones:',
            'Institución:', 'Institución que otorga el grado o título:',
            'Disciplina académico-profesional:','Grado o título:',
            'Título:','Autor(es):', 'Asesor(es):','Fecha de publicación:',
            'Palabras clave:','Resumen:','Fecha de registro:', 'Campo OCDE:',
            'Jurado:', 'Nota:', 'Otros títulos:', 'Identificador DOI:']

A_records = A_records.reindex(columns=col_ord1)
R_records = R_records.reindex(columns=col_ord2)

# Generando identificadores únicos
A_records[['title_id', 'authors_id', 'unique_id']] = A_records.apply(
    lambda row: generate_unique_id(row['Título:'], row['Autor:']), axis=1, result_type='expand')

R_records[['title_id', 'authors_id', 'unique_id']] = R_records.apply(
    lambda row: generate_unique_id(row['Título:'], row['Autor(es):']), axis=1, result_type='expand')

# Guardando los dataframes
A_records.to_excel(os.path.join(output_dir, "ALICIA_Records.xlsx"), index=False)
R_records.to_excel(os.path.join(output_dir, "RENATI_Records.xlsx"), index=False)
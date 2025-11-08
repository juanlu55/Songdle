#!/usr/bin/env python3
"""
Script para recopilar datos de canciones de Los40 año por año
Utiliza la API de Los40 para obtener las listas desde 1990 hasta 2025
"""

import requests
import csv
import time
import json
import sys
from datetime import datetime
from urllib.parse import quote

# Headers para simular un navegador real
HEADERS = {
    'accept': '*/*',
    'accept-language': 'es-ES,es;q=0.9,fr-FR;q=0.8,fr;q=0.7,da-DK;q=0.6,da;q=0.5,it-IT;q=0.4,it;q=0.3,en-NZ;q=0.2,en;q=0.1',
    'priority': 'u=1, i',
    'referer': 'https://los40.com/lista40/listas-anteriores/',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
}

def build_api_url(date_from, date_to):
    """Construye la URL de la API con los parámetros correctos"""
    query = {
        "productId": "2",
        "date": None,
        "dateFrom": date_from,
        "dateTo": date_to,
        "order": "asc",
        "orderBy": "position",
        "itemsPerPage": 100,
        "position": None
    }
    query_str = json.dumps(query)
    encoded_query = quote(query_str)
    return f"https://los40.com/pf/api/v3/content/fetch/lista40-api?query={encoded_query}"

def fetch_songs_for_year(year):
    """Obtiene las canciones de un año específico"""
    date_from = f"{year}-01-01"
    date_to = f"{year}-12-31"
    
    url = build_api_url(date_from, date_to)
    
    print(f"Obteniendo datos para el año {year}...", flush=True)
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        if data:
            print(f"  ✓ Se encontraron {len(data)} canciones para {year}", flush=True)
            return data
        else:
            print(f"  ⚠ No se encontraron canciones para {year}", flush=True)
            return []
    
    except requests.exceptions.RequestException as e:
        print(f"  ✗ Error al obtener datos para {year}: {e}", flush=True)
        return []

def main():
    """Función principal"""
    start_year = 1990
    end_year = 2025
    output_file = "los40_songs_1990_2025.csv"
    
    all_songs = []
    
    # Recopilar datos año por año
    for year in range(start_year, end_year + 1):
        songs = fetch_songs_for_year(year)
        all_songs.extend(songs)
        
        # Esperar 10 segundos entre llamadas (excepto en la última)
        if year < end_year:
            print(f"  Esperando 10 segundos antes de la siguiente llamada...", flush=True)
            time.sleep(10)
    
    # Guardar en CSV
    if all_songs:
        # Obtener todas las claves únicas de todos los registros
        all_keys = set()
        for song in all_songs:
            all_keys.update(song.keys())
        
        fieldnames = sorted(list(all_keys))
        
        print(f"\nGuardando {len(all_songs)} canciones en {output_file}...", flush=True)
        
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_songs)
        
        print(f"✓ Datos guardados exitosamente en {output_file}", flush=True)
        print(f"  Total de canciones: {len(all_songs)}", flush=True)
        print(f"  Columnas: {len(fieldnames)}", flush=True)
    else:
        print("\n⚠ No se obtuvieron datos para guardar", flush=True)

if __name__ == "__main__":
    print("=" * 60, flush=True)
    print("  Script de recopilación de canciones de Los40", flush=True)
    print(f"  Período: 1990 - 2025", flush=True)
    print("=" * 60, flush=True)
    print(flush=True)
    
    main()
    
    print(flush=True)
    print("=" * 60, flush=True)
    print("  Proceso completado", flush=True)
    print("=" * 60, flush=True)


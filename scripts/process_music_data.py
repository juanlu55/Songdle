#!/usr/bin/env python3
"""
Script para procesar los CSVs de musicoset y generar un CSV unificado
con todos los campos necesarios para Songdle
"""

import csv
import os
from collections import defaultdict

# Rutas de los archivos
BASE_DIR = '/Users/JuanLuis/Documents/SinSorpresas/musicoset_metadata'
OUTPUT_FILE = '/Users/JuanLuis/Documents/SinSorpresas/musicoset_metadata/songdle_songs.csv'

def parse_dict_field(field_str):
    """Parsea campos que vienen como string de diccionario"""
    try:
        # Eliminar comillas y llaves
        field_str = field_str.strip("{}'\"")
        if not field_str:
            return {}
        
        # Parsear manualmente los pares key: value
        result = {}
        pairs = field_str.split("', '")
        for pair in pairs:
            if ': ' in pair:
                key, value = pair.split(': ', 1)
                key = key.strip("'{}")
                value = value.strip("'{}")
                result[key] = value
        return result
    except:
        return {}

def get_first_artist(artists_dict_str):
    """Extrae el primer artista del diccionario de artistas"""
    artists = parse_dict_field(artists_dict_str)
    if artists:
        return list(artists.values())[0]
    return "Unknown Artist"

def get_first_artist_id(artists_dict_str):
    """Extrae el primer artist_id del diccionario de artistas"""
    artists = parse_dict_field(artists_dict_str)
    if artists:
        return list(artists.keys())[0]
    return None

def extract_year_decade(release_date):
    """Extrae el año y la década de una fecha"""
    if not release_date or release_date == '':
        return None, None
    
    try:
        year = int(release_date.split('-')[0])
        decade = f"{(year // 10) * 10}s"
        return year, decade
    except:
        return None, None

def main():
    print("🎵 Procesando base de datos de canciones...")
    
    # 1. Cargar artistas
    print("📖 Cargando artistas...")
    artists = {}
    with open(os.path.join(BASE_DIR, 'artists.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            artists[row['artist_id']] = {
                'name': row['name'],
                'artist_type': row['artist_type'],
                'main_genre': row['main_genre'],
                'popularity': row['popularity']
            }
    print(f"   ✓ {len(artists)} artistas cargados")
    
    # 2. Cargar tracks (para obtener release_date)
    print("📖 Cargando tracks...")
    tracks = {}
    with open(os.path.join(BASE_DIR, 'tracks.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            tracks[row['song_id']] = {
                'release_date': row['release_date'],
                'album_id': row['album_id']
            }
    print(f"   ✓ {len(tracks)} tracks cargados")
    
    # 3. Procesar canciones y generar CSV de salida
    print("📖 Procesando canciones...")
    output_songs = []
    
    with open(os.path.join(BASE_DIR, 'songs.csv'), 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        
        for idx, row in enumerate(reader):
            song_id = row['song_id']
            song_name = row['song_name']
            artists_str = row['artists']
            popularity = row['popularity']
            song_type = row['song_type']
            
            # Obtener primer artista
            artist_name = get_first_artist(artists_str)
            artist_id = get_first_artist_id(artists_str)
            
            # Obtener info del artista
            artist_info = artists.get(artist_id, {})
            artist_type = artist_info.get('artist_type', '')
            main_genre = artist_info.get('main_genre', '')
            
            # Obtener fecha de lanzamiento
            track_info = tracks.get(song_id, {})
            release_date = track_info.get('release_date', '')
            year, decade = extract_year_decade(release_date)
            
            # Crear entrada
            song_entry = {
                'id': str(idx + 1),
                'title': song_name,
                'artist': artist_name,
                'genre': main_genre,
                'decade': decade if decade else '',
                'year': year if year else '',
                'artist_type': artist_type,
                'song_type': song_type,
                'popularity': popularity,
                'country': '',  # A completar manualmente
                'language': '',  # A completar manualmente
                'voices': ''  # A completar manualmente (Masculino/Femenino/Mixto)
            }
            
            output_songs.append(song_entry)
            
            if (idx + 1) % 1000 == 0:
                print(f"   Procesadas {idx + 1} canciones...")
    
    # 4. Escribir CSV de salida
    print(f"\n💾 Escribiendo archivo de salida...")
    fieldnames = ['id', 'title', 'artist', 'genre', 'decade', 'year', 'artist_type', 
                  'song_type', 'popularity', 'country', 'language', 'voices']
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(output_songs)
    
    print(f"   ✓ Archivo guardado: {OUTPUT_FILE}")
    print(f"\n✅ Proceso completado!")
    print(f"📊 Total de canciones: {len(output_songs)}")
    print(f"\n📝 Campos a completar manualmente:")
    print(f"   - country: País de origen del artista")
    print(f"   - language: Idioma de la canción")
    print(f"   - voices: Tipo de voces (Masculino/Femenino/Mixto)")
    print(f"\n💡 Tip: Puedes filtrar por popularidad para trabajar primero con las canciones más conocidas")

if __name__ == '__main__':
    main()


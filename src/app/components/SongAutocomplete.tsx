"use client";

import { useEffect, useRef, useState } from "react";
import { songs, type Song } from "@/app/data/songs";

export default function SongAutocomplete({
  guess,
  onGuessChange,
  onSelect,
  disabled,
  alreadyGuessed,
}: {
  guess: string;
  onGuessChange: (value: string) => void;
  onSelect: (song: Song) => void;
  disabled?: boolean;
  alreadyGuessed: string[];
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    onGuessChange(value);
    if (value.trim().length > 0) {
      setFilteredSongs(
        songs.filter((song) =>
          song.displayName.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredSongs(songs);
    }
    setShowSuggestions(true);
  };

  return (
    <div className="flex-1 relative" ref={inputRef}>
      <input
        type="text"
        value={guess}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (guess.trim().length === 0) setFilteredSongs(songs);
          setShowSuggestions(true);
        }}
        placeholder="Escribe el nombre de la canción..."
        className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-0 font-medium bg-white"
        disabled={disabled}
      />

      {showSuggestions && filteredSongs.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-60 overflow-y-auto">
          {filteredSongs.length === songs.length && (
            <div className="px-4 py-2 text-xs font-bold text-black/40 bg-[#f5f1e8] border-b-2 border-black uppercase tracking-wide">
              {filteredSongs.length} canciones
            </div>
          )}
          {filteredSongs.map((song) => {
            const used = alreadyGuessed.some(
              (g) => g.toLowerCase() === song.displayName.toLowerCase()
            );
            return (
              <button
                key={song.id}
                type="button"
                onClick={() => {
                  onSelect(song);
                  setShowSuggestions(false);
                }}
                disabled={used}
                className={`w-full px-4 py-2 text-left transition-colors border-b-2 border-black last:border-b-0 font-medium ${
                  used
                    ? "bg-gray-200 text-black/40 cursor-not-allowed line-through"
                    : "hover:bg-[#a8e6cf]"
                }`}
              >
                {song.displayName}
                {used && <span className="ml-2 text-xs">✓ Ya usada</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

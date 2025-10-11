"use client";

import { useState, useEffect, useRef } from "react";
import { songs, todaySong, Song } from "./data/songs";

interface ClueMatch {
  genre: boolean;
  decade: boolean;
  country: boolean;
  language: boolean;
  voices: boolean;
}

interface Attempt {
  guess: string;
  time: number;
  isCorrect: boolean;
  clues?: ClueMatch;
}

interface GameState {
  attempts: Attempt[];
  elapsedTime: number;
  gameWon: boolean;
  gameLost: boolean;
}

const STORAGE_KEY = "songdle-game-state";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const MAX_ATTEMPTS = 6;
  const MAX_LISTEN_TIME = 10; // Máximo 10 segundos de escucha

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const state: GameState = JSON.parse(savedState);
        setAttempts(state.attempts);
        setElapsedTime(state.elapsedTime);
        setGameWon(state.gameWon);
        setGameLost(state.gameLost);
      } catch (error) {
        console.error("Error loading game state:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar datos en localStorage cada vez que cambian
  useEffect(() => {
    if (isLoaded) {
      const state: GameState = {
        attempts,
        elapsedTime,
        gameWon,
        gameLost,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [attempts, elapsedTime, gameWon, gameLost, isLoaded]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Temporizador que solo corre cuando está reproduciendo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !gameWon && !gameLost) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      interval = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = (Date.now() - startTimeRef.current) / 1000;
          
          // Si alcanza el máximo de tiempo, pausar automáticamente
          if (currentElapsed >= MAX_LISTEN_TIME) {
            setElapsedTime(MAX_LISTEN_TIME);
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
          } else {
            setElapsedTime(currentElapsed);
          }
        }
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon, gameLost, elapsedTime]);

  // Manejar reproducción de audio
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // No permitir reproducir si ya se llegó al máximo
      if (elapsedTime >= MAX_LISTEN_TIME) {
        return;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Filtrar canciones para autocompletado
  const handleInputChange = (value: string) => {
    setGuess(value);
    if (value.trim().length > 0) {
      const filtered = songs.filter((song) =>
        song.displayName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSongs(filtered);
    } else {
      // Si está vacío, mostrar todas las canciones
      setFilteredSongs(songs);
    }
    setShowSuggestions(true);
  };

  // Manejar el foco en el input
  const handleInputFocus = () => {
    if (guess.trim().length === 0) {
      setFilteredSongs(songs);
    }
    setShowSuggestions(true);
  };

  // Seleccionar una canción del autocompletado
  const selectSong = (song: Song) => {
    setGuess(song.displayName);
    setShowSuggestions(false);
  };

  // Enviar respuesta
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || elapsedTime === 0) return;

    // Buscar la canción seleccionada
    const guessedSong = songs.find((song) => 
      guess.toLowerCase().includes(song.title.toLowerCase()) ||
      guess.toLowerCase() === song.displayName.toLowerCase()
    );

    const isCorrect = guess.toLowerCase().includes(todaySong.title.toLowerCase()) ||
                      guess.toLowerCase().includes(todaySong.displayName.toLowerCase());

    // Calcular pistas si encontramos la canción
    let clues: ClueMatch | undefined;
    if (guessedSong) {
      clues = {
        genre: guessedSong.genre === todaySong.genre,
        decade: guessedSong.decade === todaySong.decade,
        country: guessedSong.country === todaySong.country,
        language: guessedSong.language === todaySong.language,
        voices: guessedSong.voices === todaySong.voices,
      };
    }

    const newAttempt: Attempt = {
      guess,
      time: elapsedTime,
      isCorrect,
      clues,
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);
    setGuess("");
    setShowSuggestions(false);

    if (isCorrect) {
      setGameWon(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      setGameLost(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  };

  // Compartir resultados
  const shareResults = () => {
    const emoji = gameWon ? "🎯" : "❌";
    const attemptsText = gameWon ? `${attempts.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
    const time = attempts[attempts.length - 1]?.time.toFixed(2) || "0.00";
    
    // Generar cuadrados de pistas
    const clueLines = attempts.map((attempt) => {
      if (!attempt.clues) return "⬜⬜⬜⬜⬜";
      const { genre, decade, country, language, voices } = attempt.clues;
      return `${genre ? "🟩" : "🟥"}${decade ? "🟩" : "🟥"}${country ? "🟩" : "🟥"}${language ? "🟩" : "🟥"}${voices ? "🟩" : "🟥"}`;
    }).join("\n");
    
    const shareText = `🎵 Songdle #1
${emoji} ${attemptsText} intentos
⏱️ ${time} segundos

${clueLines}

¿Puedes superarme?`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert("¡Resultados copiados al portapapeles!");
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🎵 Songdle
          </h1>
          <p className="text-gray-600">
            ¡Adivina la canción en {MAX_ATTEMPTS} intentos!
          </p>
        </div>

        {/* Main Game Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {!gameWon && !gameLost ? (
            <>
              {/* Audio Player */}
              <div className="mb-6 text-center">
                <audio ref={audioRef} src={todaySong.audioUrl} loop />
                <button
                  onClick={togglePlay}
                  disabled={elapsedTime >= MAX_LISTEN_TIME}
                  className={`rounded-full w-20 h-20 flex items-center justify-center text-3xl shadow-lg transition-transform mx-auto ${
                    elapsedTime >= MAX_LISTEN_TIME
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105"
                  }`}
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  {elapsedTime >= MAX_LISTEN_TIME
                    ? "⏱️ Tiempo máximo alcanzado"
                    : isPlaying
                    ? "Reproduciendo..."
                    : "Haz clic para escuchar"}
                </p>
              </div>

              {/* Timer */}
              {elapsedTime > 0 && (
                <div className="text-center mb-6">
                  <div className={`text-3xl font-mono font-bold ${
                    elapsedTime >= MAX_LISTEN_TIME ? "text-red-600" : "text-purple-600"
                  }`}>
                    ⏱️ {elapsedTime.toFixed(2)}s / {MAX_LISTEN_TIME}s
                  </div>
                  {elapsedTime >= MAX_LISTEN_TIME && (
                    <p className="text-sm text-red-600 mt-2 font-semibold">
                      ¡Has alcanzado el tiempo máximo de escucha!
                    </p>
                  )}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="mb-6 relative">
                <div className="flex gap-2">
                  <div className="flex-1 relative" ref={inputRef}>
                    <input
                      type="text"
                      value={guess}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="Escribe el nombre de la canción..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                      disabled={elapsedTime === 0}
                    />
                    
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && filteredSongs.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSongs.length === songs.length && (
                          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                            {filteredSongs.length} canciones disponibles
                          </div>
                        )}
                        {filteredSongs.map((song) => (
                          <button
                            key={song.id}
                            type="button"
                            onClick={() => selectSong(song)}
                            className="w-full px-4 py-2 text-left hover:bg-purple-100 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {song.displayName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!guess.trim() || elapsedTime === 0}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enviar
                  </button>
                </div>
              </form>

              {/* Attempts Counter */}
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Intentos: <span className="font-bold">{attempts.length}/{MAX_ATTEMPTS}</span>
                </p>
              </div>

              {/* Attempts History */}
              {attempts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 mb-2">Tus intentos:</h3>
                  {attempts.map((attempt, index) => {
                    // Buscar la canción intentada para obtener sus valores
                    const attemptedSong = songs.find((song) => 
                      attempt.guess.toLowerCase().includes(song.title.toLowerCase()) ||
                      attempt.guess.toLowerCase() === song.displayName.toLowerCase()
                    );
                    
                    return (
                      <div
                        key={index}
                        className="p-3 rounded-lg border-2 border-gray-300 bg-white"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {attempt.isCorrect ? "✅" : "❌"}
                            </span>
                            <span className="font-medium">{attempt.guess}</span>
                          </div>
                          <span className="text-sm text-gray-600 font-mono">
                            {attempt.time.toFixed(2)}s
                          </span>
                        </div>
                        
                        {/* Clues */}
                        {attempt.clues && attemptedSong && (
                          <div className="grid grid-cols-5 gap-1.5">
                            {/* Género */}
                            <div className={`p-2 rounded-lg text-center ${
                              attempt.clues.genre 
                                ? "bg-green-500" 
                                : "bg-red-500"
                            }`}>
                              <div className="text-base mb-1">🎸</div>
                              <div className="text-xs text-white font-medium truncate">
                                {attemptedSong.genre}
                              </div>
                            </div>
                            
                            {/* Década */}
                            <div className={`p-2 rounded-lg text-center ${
                              attempt.clues.decade 
                                ? "bg-green-500" 
                                : "bg-red-500"
                            }`}>
                              <div className="text-base mb-1">📅</div>
                              <div className="text-xs text-white font-medium">
                                {attemptedSong.decade}
                              </div>
                            </div>
                            
                            {/* País */}
                            <div className={`p-2 rounded-lg text-center ${
                              attempt.clues.country 
                                ? "bg-green-500" 
                                : "bg-red-500"
                            }`}>
                              <div className="text-base mb-1">🌍</div>
                              <div className="text-xs text-white font-medium truncate">
                                {attemptedSong.country}
                              </div>
                            </div>
                            
                            {/* Idioma */}
                            <div className={`p-2 rounded-lg text-center ${
                              attempt.clues.language 
                                ? "bg-green-500" 
                                : "bg-red-500"
                            }`}>
                              <div className="text-base mb-1">🗣️</div>
                              <div className="text-xs text-white font-medium truncate">
                                {attemptedSong.language}
                              </div>
                            </div>
                            
                            {/* Voces */}
                            <div className={`p-2 rounded-lg text-center ${
                              attempt.clues.voices 
                                ? "bg-green-500" 
                                : "bg-red-500"
                            }`}>
                              <div className="text-base mb-1">🎤</div>
                              <div className="text-xs text-white font-medium truncate">
                                {attemptedSong.voices}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Clues Legend - Small and at the bottom */}
                  <div className="mt-4 p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span>🎸 Género</span>
                      <span>📅 Década</span>
                      <span>🌍 País</span>
                      <span>🗣️ Idioma</span>
                      <span>🎤 Voces</span>
                      <span className="ml-1">|</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded"></span>
                        <span>Correcto</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded"></span>
                        <span>Incorrecto</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Victory/Defeat Screen */
            <div className="text-center">
              <div className="text-6xl mb-4">
                {gameWon ? "🎉" : "😢"}
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                {gameWon ? "¡Felicidades!" : "¡Suerte la próxima vez!"}
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-lg mb-2">
                  La canción era: <span className="font-bold text-purple-600">{todaySong.displayName}</span>
                </p>
                
                {gameWon && (
                  <div className="mt-4 space-y-2">
                    <p className="text-2xl font-bold text-purple-600">
                      ⏱️ {attempts[attempts.length - 1]?.time.toFixed(2)} segundos
                    </p>
                    <p className="text-lg">
                      🎯 {attempts.length}/{MAX_ATTEMPTS} intentos
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={shareResults}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📋 Compartir Resultados
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-6 text-center">
                ¡Vuelve mañana para una nueva canción! 🎵
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!gameWon && !gameLost && attempts.length === 0 && (
          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>Presiona play para escuchar la canción y comienza a adivinar</p>
          </div>
        )}
      </div>
    </div>
  );
}

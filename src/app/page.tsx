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

interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: { [key: number]: number }; // 1-6 intentos
  totalTime: number; // tiempo acumulado en segundos
  lastPlayedDate: string;
}

const STORAGE_KEY = "songdle-game-state";
const STATS_KEY = "songdle-statistics";
const TUTORIAL_KEY = "songdle-tutorial-seen";

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
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    totalTime: 0,
    lastPlayedDate: "",
  });
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const statsUpdatedRef = useRef(false);
  const attemptsContainerRef = useRef<HTMLDivElement>(null);
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
        
        // Si el juego ya terminó, marcar que las estadísticas ya están actualizadas
        if (state.gameWon || state.gameLost) {
          statsUpdatedRef.current = true;
        }
      } catch (error) {
        console.error("Error loading game state:", error);
      }
    }
    
    // Cargar estadísticas
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
      try {
        const stats: Statistics = JSON.parse(savedStats);
        setStatistics(stats);
      } catch (error) {
        console.error("Error loading statistics:", error);
      }
    }
    
    // Verificar si es la primera vez
    const tutorialSeen = localStorage.getItem(TUTORIAL_KEY);
    if (!tutorialSeen) {
      setShowHowToPlay(true);
      localStorage.setItem(TUTORIAL_KEY, "true");
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

  // Auto-scroll al último intento cuando se añade uno nuevo
  useEffect(() => {
    if (attemptsContainerRef.current && attempts.length > 0) {
      attemptsContainerRef.current.scrollTo({
        top: attemptsContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [attempts.length]);

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
      updateStatistics(true, newAttempts.length, elapsedTime);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      setGameLost(true);
      updateStatistics(false, newAttempts.length, elapsedTime);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  };

  // Actualizar estadísticas
  const updateStatistics = (won: boolean, attemptCount: number, time: number) => {
    if (statsUpdatedRef.current) return; // Evitar actualizar dos veces
    statsUpdatedRef.current = true;

    const today = new Date().toDateString();
    const wonYesterday = statistics.lastPlayedDate !== "" && 
                         statistics.lastPlayedDate !== today &&
                         statistics.gamesWon > 0;

    const newStats: Statistics = {
      gamesPlayed: statistics.gamesPlayed + 1,
      gamesWon: won ? statistics.gamesWon + 1 : statistics.gamesWon,
      currentStreak: won 
        ? (wonYesterday ? statistics.currentStreak + 1 : 1)
        : 0,
      maxStreak: 0, // se calcula después
      guessDistribution: { ...statistics.guessDistribution },
      totalTime: won ? statistics.totalTime + time : statistics.totalTime,
      lastPlayedDate: today,
    };

    // Actualizar distribución si ganó
    if (won && attemptCount >= 1 && attemptCount <= 6) {
      newStats.guessDistribution[attemptCount] = 
        (newStats.guessDistribution[attemptCount] || 0) + 1;
    }

    // Calcular racha máxima
    newStats.maxStreak = Math.max(newStats.currentStreak, statistics.maxStreak);

    setStatistics(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
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
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2500);
    });
  };


  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="mb-6 relative">
          <div className="flex items-start justify-between mb-2">
            <div className="inline-block border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-5xl font-black text-black tracking-tight">
                SONGDLE
          </h1>
            </div>
            
            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowHowToPlay(true)}
                className="border-4 border-black bg-white p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                title="Cómo jugar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowStats(!showStats)}
                className="border-4 border-black bg-white p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                title="Ver estadísticas"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-black"></div>
            <p className="text-black/60 text-sm font-bold uppercase tracking-wider">
              Adivina la canción — {MAX_ATTEMPTS} intentos máximo
            </p>
          </div>
        </div>

        {/* Main Game Card */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          {!gameWon && !gameLost ? (
            <>
              {/* Audio Player */}
              <div className="mb-6">
                <audio ref={audioRef} src={todaySong.audioUrl} loop />
                <div className="flex items-center justify-center gap-4">
                <button
                  onClick={togglePlay}
                  disabled={elapsedTime >= MAX_LISTEN_TIME}
                    className={`w-16 h-16 flex items-center justify-center text-2xl border-4 border-black font-black transition-all ${
                    elapsedTime >= MAX_LISTEN_TIME
                        ? "bg-gray-300 cursor-not-allowed"
                        : isPlaying
                        ? "bg-[#ff6b6b] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
                        : "bg-[#ff6b6b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {isPlaying ? "❚❚" : "▶"}
                </button>
                  <div className="text-left">
                    <p className="text-xs font-bold text-black/60 uppercase tracking-wide">
                  {elapsedTime >= MAX_LISTEN_TIME
                        ? "Tiempo máximo"
                    : isPlaying
                        ? "● Reproduciendo"
                        : elapsedTime > 0
                        ? "En pausa"
                        : "Presiona play"}
                    </p>
                    {!isPlaying && elapsedTime > 0 && elapsedTime < MAX_LISTEN_TIME && (
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-wide mt-1">
                        El tiempo se detiene
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Timer */}
              {elapsedTime > 0 && (
                <div className="mb-6 border-4 border-black bg-black text-white p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">Tiempo</span>
                    <div className="font-mono text-3xl font-black tracking-tighter">
                      {elapsedTime.toFixed(2)}<span className="text-sm">s</span> / {MAX_LISTEN_TIME}<span className="text-sm">s</span>
                    </div>
                  </div>
                  {elapsedTime >= MAX_LISTEN_TIME && (
                    <p className="text-xs mt-2 text-[#ff6b6b] font-bold">
                      ¡Límite alcanzado!
                    </p>
                  )}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="mb-6 relative">
                <div className="flex gap-3">
                  <div className="flex-1 relative" ref={inputRef}>
                    <input
                      type="text"
                      value={guess}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="Escribe el nombre de la canción..."
                      className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-0 font-medium bg-white"
                      disabled={elapsedTime === 0}
                    />
                    
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && filteredSongs.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-60 overflow-y-auto">
                        {filteredSongs.length === songs.length && (
                          <div className="px-4 py-2 text-xs font-bold text-black/40 bg-[#f5f1e8] border-b-2 border-black uppercase tracking-wide">
                            {filteredSongs.length} canciones
                          </div>
                        )}
                        {filteredSongs.map((song) => (
                          <button
                            key={song.id}
                            type="button"
                            onClick={() => selectSong(song)}
                            className="w-full px-4 py-2 text-left hover:bg-[#a8e6cf] transition-colors border-b-2 border-black last:border-b-0 font-medium"
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
                    className="px-6 py-3 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Enviar
                  </button>
                </div>
              </form>

              {/* Attempts Counter */}
              <div className="mb-4 border-4 border-black bg-[#f5f1e8] p-3">
                <p className="text-black font-bold text-center">
                  Intentos: <span className="text-2xl font-black">{attempts.length}</span>/{MAX_ATTEMPTS}
                </p>
              </div>

              {/* Attempts History - Contenedor con altura fija */}
              <div className="h-[400px] border-4 border-black bg-[#f5f1e8] p-4">
                {attempts.length > 0 ? (
                  <div className="h-full flex flex-col">
                    <h3 className="font-black text-black mb-3 uppercase tracking-wide text-sm flex-shrink-0">Tus intentos:</h3>
                    <div ref={attemptsContainerRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {attempts.map((attempt, index) => {
                    // Buscar la canción intentada para obtener sus valores
                    const attemptedSong = songs.find((song) => 
                      attempt.guess.toLowerCase().includes(song.title.toLowerCase()) ||
                      attempt.guess.toLowerCase() === song.displayName.toLowerCase()
                    );
                    
                    return (
                      <div
                        key={index}
                        className="border-4 border-black bg-white p-3"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black">
                              {attempt.isCorrect ? "✓" : "✗"}
                            </span>
                            <span className="font-bold text-sm">{attempt.guess}</span>
                          </div>
                          <span className="text-xs text-black/60 font-mono font-bold border-2 border-black px-2 py-1">
                            {attempt.time.toFixed(2)}s
                          </span>
                        </div>
                        
                        {/* Clues */}
                        {attempt.clues && attemptedSong && (
                          <div className="grid grid-cols-5 gap-2">
                            {/* Género */}
                            <div className={`border-2 border-black p-2 text-center ${
                              attempt.clues.genre 
                                ? "bg-[#a8e6cf]" 
                                : "bg-[#ff6b6b]"
                            }`}>
                              <div className="text-xs font-black mb-1">GEN</div>
                              <div className="text-[10px] font-bold truncate">
                                {attemptedSong.genre}
                              </div>
                            </div>
                            
                            {/* Década */}
                            <div className={`border-2 border-black p-2 text-center ${
                              attempt.clues.decade 
                                ? "bg-[#a8e6cf]" 
                                : "bg-[#ff6b6b]"
                            }`}>
                              <div className="text-xs font-black mb-1">DEC</div>
                              <div className="text-[10px] font-bold">
                                {attemptedSong.decade}
                              </div>
                            </div>
                            
                            {/* País */}
                            <div className={`border-2 border-black p-2 text-center ${
                              attempt.clues.country 
                                ? "bg-[#a8e6cf]" 
                                : "bg-[#ff6b6b]"
                            }`}>
                              <div className="text-xs font-black mb-1">PAÍ</div>
                              <div className="text-[10px] font-bold truncate">
                                {attemptedSong.country}
                              </div>
                            </div>
                            
                            {/* Idioma */}
                            <div className={`border-2 border-black p-2 text-center ${
                              attempt.clues.language 
                                ? "bg-[#a8e6cf]" 
                                : "bg-[#ff6b6b]"
                            }`}>
                              <div className="text-xs font-black mb-1">IDI</div>
                              <div className="text-[10px] font-bold truncate">
                                {attemptedSong.language}
                              </div>
                            </div>
                            
                            {/* Voces */}
                            <div className={`border-2 border-black p-2 text-center ${
                              attempt.clues.voices 
                                ? "bg-[#a8e6cf]" 
                                : "bg-[#ff6b6b]"
                            }`}>
                              <div className="text-xs font-black mb-1">VOZ</div>
                              <div className="text-[10px] font-bold truncate">
                                {attemptedSong.voices}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                    </div>
                    
                    {/* Clues Legend - Small and at the bottom */}
                    <div className="mt-3 p-2 border-2 border-black bg-white flex-shrink-0">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-black/60 flex-wrap uppercase">
                        <span>Gen=Género</span>
                        <span>•</span>
                        <span>Dec=Década</span>
                        <span>•</span>
                        <span>Paí=País</span>
                        <span>•</span>
                        <span>Idi=Idioma</span>
                        <span>•</span>
                        <span>Voz=Voces</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-black/40 font-bold uppercase text-sm text-center">
                      Tus intentos aparecerán aquí
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Victory/Defeat Screen */
            <div>
              <div className="border-4 border-black bg-black text-white p-6 mb-6">
                <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">
                  {gameWon ? "¡Ganaste!" : "Perdiste"}
                </h2>
                <p className="text-sm font-bold text-white/60 uppercase tracking-wide">
                  {gameWon ? "Lo conseguiste" : "Suerte la próxima"}
                </p>
              </div>
              
              <div className="border-4 border-black bg-[#f5f1e8] p-6 mb-6">
                <p className="text-xs font-bold uppercase tracking-wide text-black/60 mb-2">
                  La canción era:
                </p>
                <p className="text-xl font-black text-black mb-4">
                  {todaySong.displayName}
                </p>
                
                {gameWon && (
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1 border-4 border-black bg-white p-3 text-center">
                      <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">Tiempo</div>
                      <div className="text-2xl font-black font-mono">
                        {attempts[attempts.length - 1]?.time.toFixed(2)}s
                      </div>
                    </div>
                    <div className="flex-1 border-4 border-black bg-white p-3 text-center">
                      <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">Intentos</div>
                      <div className="text-2xl font-black">
                        {attempts.length}/{MAX_ATTEMPTS}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative mb-4">
                <button
                  onClick={shareResults}
                  className="w-full py-4 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Compartir Resultados
                </button>
                
                {/* Mensaje de copiado */}
                {showCopiedMessage && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 border-4 border-black bg-[#a8e6cf] px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce z-50">
                    <p className="text-sm font-black uppercase whitespace-nowrap">
                      ✓ Copiado al portapapeles
                    </p>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-center text-black/60 font-bold uppercase tracking-wide mb-6">
                Vuelve mañana para una nueva canción
              </p>

              {/* Estadísticas */}
              <div className="border-4 border-black bg-white p-6">
                <h3 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
                  Estadísticas
                </h3>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                    <div className="text-2xl font-black">{statistics.gamesPlayed}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Jugadas</div>
                  </div>
                  <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                    <div className="text-2xl font-black">
                      {statistics.gamesPlayed > 0 
                        ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
                        : 0}%
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Victorias</div>
                  </div>
                  <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                    <div className="text-2xl font-black">{statistics.currentStreak}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Racha</div>
                  </div>
                  <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                    <div className="text-2xl font-black">{statistics.maxStreak}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Mejor</div>
                  </div>
                </div>

                {/* Distribución de intentos */}
                <div className="mb-4">
                  <h4 className="text-xs font-black uppercase tracking-wide mb-3 text-black/60">
                    Distribución de victorias
                  </h4>
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const count = statistics.guessDistribution[num] || 0;
                    const maxCount = Math.max(...Object.values(statistics.guessDistribution), 1);
                    const percentage = (count / maxCount) * 100;
                    const isCurrentGame = gameWon && attempts.length === num;
                    
                    return (
                      <div key={num} className="flex items-center gap-2 mb-2">
                        <div className="text-xs font-black w-3">{num}</div>
                        <div className="flex-1 flex items-center">
                          <div 
                            className={`h-6 border-2 border-black flex items-center justify-end pr-2 transition-all ${
                              isCurrentGame ? 'bg-[#a8e6cf]' : 'bg-[#f5f1e8]'
                            }`}
                            style={{ width: `${Math.max(percentage, 8)}%` }}
                          >
                            <span className="text-xs font-bold">{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tiempo medio */}
                {statistics.gamesWon > 0 && (
                  <div className="border-2 border-black bg-[#f5f1e8] p-3 text-center">
                    <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">
                      Tiempo medio
                    </div>
                    <div className="text-xl font-black font-mono">
                      {(statistics.totalTime / statistics.gamesWon).toFixed(2)}s
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!gameWon && !gameLost && attempts.length === 0 && (
          <div className="mt-4 border-4 border-black bg-black p-3">
            <p className="text-white text-xs font-bold uppercase tracking-wide text-center">
              Presiona ▶ para escuchar — Pausa cuando sepas la canción
            </p>
          </div>
        )}
        
        {/* Modal de Estadísticas */}
        {showStats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowStats(false)}>
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  Estadísticas
                </h3>
                <button
                  onClick={() => setShowStats(false)}
                  className="text-2xl font-black hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                  <div className="text-2xl font-black">{statistics.gamesPlayed}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Jugadas</div>
                </div>
                <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                  <div className="text-2xl font-black">
                    {statistics.gamesPlayed > 0 
                      ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
                      : 0}%
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Victorias</div>
                </div>
                <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                  <div className="text-2xl font-black">{statistics.currentStreak}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Racha</div>
                </div>
                <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
                  <div className="text-2xl font-black">{statistics.maxStreak}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Mejor</div>
                </div>
              </div>

              {/* Distribución de intentos */}
              <div className="mb-4">
                <h4 className="text-xs font-black uppercase tracking-wide mb-3 text-black/60">
                  Distribución de victorias
                </h4>
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const count = statistics.guessDistribution[num] || 0;
                  const maxCount = Math.max(...Object.values(statistics.guessDistribution), 1);
                  const percentage = (count / maxCount) * 100;
                  const isCurrentGame = gameWon && attempts.length === num;
                  
                  return (
                    <div key={num} className="flex items-center gap-2 mb-2">
                      <div className="text-xs font-black w-3">{num}</div>
                      <div className="flex-1 flex items-center">
                        <div 
                          className={`h-6 border-2 border-black flex items-center justify-end pr-2 transition-all ${
                            isCurrentGame ? 'bg-[#a8e6cf]' : 'bg-[#f5f1e8]'
                          }`}
                          style={{ width: `${Math.max(percentage, 8)}%` }}
                        >
                          <span className="text-xs font-bold">{count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tiempo medio */}
              {statistics.gamesWon > 0 && (
                <div className="border-2 border-black bg-[#f5f1e8] p-3 text-center">
                  <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">
                    Tiempo medio
                  </div>
                  <div className="text-xl font-black font-mono">
                    {(statistics.totalTime / statistics.gamesWon).toFixed(2)}s
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Modal de Cómo Jugar */}
        {showHowToPlay && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowHowToPlay(false)}>
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  Cómo Jugar
                </h3>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="text-2xl font-black hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Regla 1 */}
                <div className="border-2 border-black bg-[#f5f1e8] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">▶</div>
                    <h4 className="font-black uppercase text-sm">Escucha y pausa</h4>
                  </div>
                  <p className="text-xs font-medium text-black/70 leading-relaxed">
                    Presiona <span className="font-black">▶ PLAY</span> para escuchar la canción. 
                    Puedes <span className="font-black">PAUSAR ❚❚</span> cuando quieras — 
                    el tiempo se detiene mientras está en pausa.
                  </p>
                </div>

                {/* Regla 2 */}
                <div className="border-2 border-black bg-[#f5f1e8] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">⏱️</div>
                    <h4 className="font-black uppercase text-sm">Límite de tiempo</h4>
                  </div>
                  <p className="text-xs font-medium text-black/70 leading-relaxed">
                    Tienes un máximo de <span className="font-black">{MAX_LISTEN_TIME} segundos</span> de 
                    escucha total. Intenta adivinar usando el menor tiempo posible.
                  </p>
                </div>

                {/* Regla 3 */}
                <div className="border-2 border-black bg-[#f5f1e8] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🎯</div>
                    <h4 className="font-black uppercase text-sm">Adivina la canción</h4>
                  </div>
                  <p className="text-xs font-medium text-black/70 leading-relaxed">
                    Tienes <span className="font-black">{MAX_ATTEMPTS} intentos</span> para acertar. 
                    Cada intento te dará pistas sobre género, década, país, idioma y voces.
                  </p>
                </div>

                {/* Regla 4 */}
                <div className="border-2 border-black bg-[#a8e6cf] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">💡</div>
                    <h4 className="font-black uppercase text-sm">Pistas de colores</h4>
                  </div>
                  <div className="space-y-2 text-xs font-medium text-black/70">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black bg-[#a8e6cf]"></div>
                      <span><span className="font-black">Verde</span> = Coincide con la canción correcta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black bg-[#ff6b6b]"></div>
                      <span><span className="font-black">Rojo</span> = No coincide</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-full mt-6 py-3 bg-black text-white border-4 border-black font-black uppercase tracking-wide hover:bg-black/90 transition-all"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { songs, type Song } from "@/app/data/songs";
import { getTodaySong } from "@/lib/daily-song";
import { getMadridDateString } from "@/lib/madrid-date";
import { GAME_MODES } from "@/lib/game-modes";
import { getGameNumber } from "@/lib/game-number";
import {
  applyCluesAction,
  buildStageCells,
  createCluesRoundState,
  STAGE_CELL_EMOJI,
  stageCopy,
  type ClipSlot,
  type CluesAttempt,
  type CluesRoundState,
} from "@/lib/clues-game";
import {
  defaultStatistics,
  hasTripleWinToday,
  loadJson,
  loadStatistics,
  markTripleWinIfNeeded,
  saveJson,
  saveStatistics,
  updateModeStatistics,
  type Statistics,
} from "@/lib/game-storage";
import {
  buildCluesShareText,
  getShareUrl,
  getSpotifySearchUrl,
  getWhatsAppShareHref,
  renderCluesShareImageBlob,
} from "@/lib/share";
import { amplitudeEvents, initAmplitude, setAnalyticsMode } from "@/lib/amplitude";
import NextSongCountdown from "./NextSongCountdown";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";
import StatsPanel from "./StatsPanel";
import HowToPlayModal from "./HowToPlayModal";
import SongAutocomplete from "./SongAutocomplete";
import ClipPlayer from "./ClipPlayer";

type CluesMode = "tres" | "cinco";

interface StageSpec {
  kind: "audio" | "lyric" | "riddle";
  startSec?: number;
  durationSec?: number;
  slot?: ClipSlot;
}

function stagesFor(mode: CluesMode, song: Song): StageSpec[] {
  const hook = song.hookStartSec ?? 0;
  if (mode === "tres") {
    return [
      { kind: "audio", startSec: 0, durationSec: 2 },
      { kind: "lyric" },
      { kind: "audio", startSec: hook, durationSec: 6 },
    ];
  }
  return [
    { kind: "audio", slot: "intro", durationSec: 2.5 },
    { kind: "lyric" },
    { kind: "audio", slot: "bridge", durationSec: 4.5 },
    { kind: "riddle" },
    { kind: "audio", slot: "hook", durationSec: 7 },
  ];
}

function findCatalogSong(value: string): Song | undefined {
  const needle = value.trim().toLowerCase();
  return songs.find(
    (song) =>
      song.displayName.toLowerCase() === needle ||
      song.title.toLowerCase() === needle
  );
}

export default function CluesGame({ mode }: { mode: CluesMode }) {
  const config = GAME_MODES[mode];
  const [guess, setGuess] = useState("");
  const [round, setRound] = useState<CluesRoundState>(createCluesRoundState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>(() => defaultStatistics(mode));
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [todaySong, setTodaySong] = useState<Song>(() => getTodaySong(new Date(), mode));
  const [songReady, setSongReady] = useState(false);
  const [tripleWin, setTripleWin] = useState(false);
  const statsUpdatedRef = useRef(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const stages = useMemo(() => stagesFor(mode, todaySong), [mode, todaySong]);
  const currentStage = stages[round.stageIndex] ?? stages[stages.length - 1];
  const cells = useMemo(
    () => buildStageCells(round.attempts, config.maxAttempts),
    [round.attempts, config.maxAttempts]
  );
  const gameOver = round.gameWon || round.gameLost;

  useEffect(() => {
    setAnalyticsMode(mode);
    initAmplitude();
    setTodaySong(getTodaySong(new Date(), mode));
    setSongReady(true);

    const todayDate = getMadridDateString();
    const saved = loadJson<CluesRoundState & { gameDate?: string }>(config.storageKey);
    if (saved && saved.gameDate === todayDate) {
      setRound({
        attempts: saved.attempts ?? [],
        stageIndex: saved.stageIndex ?? 0,
        lastAction: saved.lastAction ?? null,
        gameWon: saved.gameWon ?? false,
        gameLost: saved.gameLost ?? false,
      });
      if (saved.gameWon || saved.gameLost) {
        statsUpdatedRef.current = true;
      }
    } else if (saved) {
      localStorage.removeItem(config.storageKey);
    }

    setStatistics(loadStatistics(mode));
    setTripleWin(hasTripleWinToday(todayDate));

    const tutorialSeen = localStorage.getItem(config.tutorialKey);
    if (!tutorialSeen) {
      setShowHowToPlay(true);
      localStorage.setItem(config.tutorialKey, "true");
    }

    setIsLoaded(true);
  }, [mode, config.storageKey, config.tutorialKey]);

  useEffect(() => {
    if (!isLoaded) return;
    saveJson(config.storageKey, {
      ...round,
      gameDate: getMadridDateString(),
    });
  }, [round, isLoaded, config.storageKey]);

  useEffect(() => {
    if (historyRef.current && round.attempts.length > 0) {
      historyRef.current.scrollTo({
        top: historyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [round.attempts.length]);

  useEffect(() => {
    if (!isLoaded || gameOver) return;
    amplitudeEvents.stageViewed(round.stageIndex + 1);
  }, [isLoaded, gameOver, round.stageIndex]);

  const recordFinish = (next: CluesRoundState) => {
    if (statsUpdatedRef.current) return;
    statsUpdatedRef.current = true;
    const winStage = next.gameWon ? next.stageIndex + 1 : next.attempts.length;
    const newStats = updateModeStatistics({
      mode,
      previous: statistics,
      won: next.gameWon,
      attemptCount: winStage,
    });
    setStatistics(newStats);
    saveStatistics(mode, newStats);
    setTimeout(() => {
      const today = getMadridDateString();
      if (markTripleWinIfNeeded(today)) {
        amplitudeEvents.tripleWin(today);
      }
      setTripleWin(hasTripleWinToday(today));
    }, 0);
  };

  const commitAttempt = (attempt: CluesAttempt) => {
    const next = applyCluesAction(round, attempt, config.maxAttempts);
    setRound(next);
    setGuess("");
    if (next.gameWon) {
      amplitudeEvents.gameWon(next.stageIndex + 1, 0, todaySong.displayName);
      recordFinish(next);
    } else if (next.gameLost) {
      amplitudeEvents.gameLost(next.attempts.length, 0, todaySong.displayName);
      recordFinish(next);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;
    const guessedSong = findCatalogSong(guess);
    if (!guessedSong) return;

    amplitudeEvents.guessSubmitted(round.stageIndex + 1, guessedSong.displayName);
    amplitudeEvents.submitClicked(round.attempts.length + 1, 0, guessedSong.displayName);

    const isCorrect =
      guessedSong.id === todaySong.id ||
      guessedSong.displayName.toLowerCase() === todaySong.displayName.toLowerCase();

    commitAttempt({
      action: "guess",
      guess: guessedSong.displayName,
      isCorrect,
      stageIndex: round.stageIndex,
    });
  };

  const handleSkip = () => {
    if (gameOver) return;
    amplitudeEvents.stageSkipped(round.stageIndex + 1);
    commitAttempt({
      action: "skip",
      isCorrect: false,
      stageIndex: round.stageIndex,
    });
  };

  const shareResults = async (medium: "native" | "clipboard" | "whatsapp" = "native") => {
    const gameNumber = getGameNumber();
    const shareUrl = getShareUrl(medium, config.path);
    const shareText = buildCluesShareText({
      mode,
      gameNumber,
      won: round.gameWon,
      stageCount: round.gameWon ? round.stageIndex + 1 : config.maxAttempts,
      maxAttempts: config.maxAttempts,
      cells,
      shareUrl,
    });

    if (medium === "whatsapp") {
      window.open(getWhatsAppShareHref(shareText), "_blank", "noopener,noreferrer");
      amplitudeEvents.shareClicked(round.attempts.length, round.gameWon, "whatsapp");
      return;
    }

    const imageBlob = await renderCluesShareImageBlob({
      mode,
      gameNumber,
      won: round.gameWon,
      stageCount: round.gameWon ? round.stageIndex + 1 : config.maxAttempts,
      maxAttempts: config.maxAttempts,
      cells,
    });
    const imageFile = imageBlob
      ? new File([imageBlob], `songdle-${mode}-${gameNumber}.png`, { type: "image/png" })
      : null;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (medium !== "clipboard" && isMobile && navigator.share) {
      try {
        const payload: ShareData = {
          title: `Songdle - ${config.title}`,
          text: shareText,
        };
        if (imageFile && navigator.canShare?.({ files: [imageFile] })) {
          payload.files = [imageFile];
        }
        await navigator.share(payload);
        amplitudeEvents.shareClicked(round.attempts.length, round.gameWon, "native");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    navigator.clipboard.writeText(shareText).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2500);
      amplitudeEvents.shareClicked(round.attempts.length, round.gameWon, "clipboard");
    });
  };

  const alreadyGuessed = round.attempts
    .filter((a) => a.guess)
    .map((a) => a.guess as string);

  const canSubmit = Boolean(findCatalogSong(guess)) && !gameOver;

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <GameHeader
          mode={mode}
          onOpenHowToPlay={() => {
            setShowHowToPlay(true);
            amplitudeEvents.tutorialOpened();
          }}
          onOpenStats={() => {
            setShowStats(true);
            amplitudeEvents.statsOpened();
          }}
        />

        <main className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6" role="main">
          {!gameOver ? (
            <>
              <div className="mb-4 border-4 border-black bg-black text-white p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">
                  Pista {round.stageIndex + 1} / {config.maxAttempts}
                </p>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {stageCopy(mode, round.stageIndex)}
                </h2>
              </div>

              {songReady && currentStage.kind === "audio" && (
                <ClipPlayer
                  song={todaySong}
                  startSec={currentStage.startSec ?? 0}
                  durationSec={currentStage.durationSec ?? 3}
                  slot={currentStage.slot}
                />
              )}

              {currentStage.kind === "lyric" && (
                <div className="mb-6 border-4 border-black bg-[#f5f1e8] p-6 text-center">
                  <p className="text-[10px] font-black uppercase tracking-wide text-black/50 mb-2">
                    Letra
                  </p>
                  <p className="text-lg font-black leading-snug">“{todaySong.lyricLine}”</p>
                </div>
              )}

              {currentStage.kind === "riddle" && (
                <div className="mb-6 border-4 border-black bg-[#f5f1e8] p-6 text-center">
                  <p className="text-[10px] font-black uppercase tracking-wide text-black/50 mb-2">
                    El título, con otras palabras
                  </p>
                  <p className="text-lg font-black leading-snug">“{todaySong.titleRiddle}”</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-3">
                  <SongAutocomplete
                    guess={guess}
                    onGuessChange={setGuess}
                    onSelect={(song) => {
                      setGuess(song.displayName);
                      amplitudeEvents.songSelected(song.displayName, true);
                    }}
                    alreadyGuessed={alreadyGuessed}
                  />
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="px-6 py-3 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Enviar
                  </button>
                </div>
              </form>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full mb-6 py-3 bg-white border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
              >
                Pasar
              </button>

              <div className="mb-4 border-4 border-black bg-[#f5f1e8] p-3">
                <div className="flex justify-center gap-2 mb-2">
                  {cells.map((cell, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 border-2 border-black flex items-center justify-center text-sm ${
                        cell === "correct"
                          ? "bg-[#a8e6cf]"
                          : cell === "wrong"
                            ? "bg-[#ff6b6b]"
                            : cell === "skip"
                              ? "bg-white"
                              : i === round.stageIndex
                                ? "bg-[#ffd700]"
                                : "bg-[#d9d3c7]"
                      }`}
                    >
                      {cell === "unused" ? "" : STAGE_CELL_EMOJI[cell]}
                    </div>
                  ))}
                </div>
                <p className="text-center text-[10px] font-bold uppercase text-black/50">
                  {config.shareIcons} · {round.attempts.length}/{config.maxAttempts}
                </p>
              </div>

              <div className="h-[240px] border-4 border-black bg-[#f5f1e8] p-4">
                {round.attempts.length > 0 ? (
                  <div ref={historyRef} className="h-full overflow-y-auto space-y-2 custom-scrollbar pr-1">
                    {round.attempts.map((attempt, index) => (
                      <div key={index} className="border-2 border-black bg-white p-2 flex justify-between items-center">
                        <span className="text-sm font-bold">
                          {attempt.action === "skip"
                            ? "Pasaste"
                            : attempt.isCorrect
                              ? `✓ ${attempt.guess}`
                              : `✗ ${attempt.guess}`}
                        </span>
                        <span className="text-[10px] font-black uppercase text-black/50">
                          Pista {attempt.stageIndex + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-black/40 font-bold uppercase text-sm text-center">
                      Adivina o pasa a la siguiente pista
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <div className="border-4 border-black bg-black text-white p-6 mb-6">
                <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">
                  {round.gameWon ? "¡Ganaste!" : "Perdiste"}
                </h2>
                <p className="text-sm font-bold text-white/60 uppercase tracking-wide">
                  {round.gameWon ? "Lo conseguiste" : "Suerte la próxima"}
                </p>
              </div>

              <div className="border-4 border-black bg-[#f5f1e8] p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {todaySong.imageUrl && (
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-32 h-32 bg-white overflow-hidden relative">
                        <Image
                          src={todaySong.imageUrl}
                          alt={todaySong.displayName}
                          fill
                          sizes="128px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold uppercase tracking-wide text-black/60 mb-2">
                      La canción era:
                    </p>
                    <p className="text-xl font-black text-black mb-2">{todaySong.title}</p>
                    <p className="text-lg font-bold text-black/70 mb-3">{todaySong.artist}</p>
                    {todaySong.numberOneDate && (
                      <div className="border-2 border-black bg-white p-2 inline-block mb-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-black/60">
                          Número 1 en Los 40
                        </p>
                        <p className="text-sm font-bold text-black">{todaySong.numberOneDate}</p>
                      </div>
                    )}
                    <div className="mt-3">
                      <a
                        href={getSpotifySearchUrl(todaySong)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm text-white"
                      >
                        Escuchar en Spotify
                      </a>
                    </div>
                  </div>
                </div>

                {round.gameWon && (
                  <div className="flex gap-4 mt-6">
                    <div className="flex-1 border-4 border-black bg-white p-3 text-center">
                      <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">
                        Pista
                      </div>
                      <div className="text-2xl font-black">
                        {round.stageIndex + 1}/{config.maxAttempts}
                      </div>
                    </div>
                    <div className="flex-1 border-4 border-black bg-white p-3 text-center">
                      <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">
                        Puntos
                      </div>
                      <div className="text-2xl font-black">
                        {config.maxAttempts - round.stageIndex}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative mb-4 space-y-3">
                <button
                  onClick={() => shareResults("whatsapp")}
                  className="w-full py-4 bg-[#25D366] text-white border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Compartir en WhatsApp
                </button>
                <button
                  onClick={() => shareResults()}
                  className="w-full py-4 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Copiar resultado
                </button>
                {showCopiedMessage && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 border-4 border-black bg-[#a8e6cf] px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce z-50">
                    <p className="text-sm font-black uppercase whitespace-nowrap">
                      ✓ Copiado al portapapeles
                    </p>
                  </div>
                )}
              </div>

              <NextSongCountdown />

              <div className="border-4 border-black bg-white p-6">
                <h3 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
                  Estadísticas
                </h3>
                <StatsPanel
                  mode={mode}
                  statistics={statistics}
                  highlightAttempt={round.gameWon ? round.stageIndex + 1 : null}
                  tripleWin={tripleWin}
                  showPointLabels={mode === "cinco"}
                />
              </div>
            </div>
          )}
        </main>

        {!gameOver && round.attempts.length === 0 && (
          <aside className="mt-4 border-4 border-black bg-black p-3">
            <p className="text-white text-xs font-bold uppercase tracking-wide text-center">
              Adivina o pulsa Pasar — cuanto antes aciertes, mejor
            </p>
          </aside>
        )}

        <GameFooter />

        {showStats && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowStats(false)}
          >
            <div
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">Estadísticas</h3>
                <button onClick={() => setShowStats(false)} className="text-2xl font-black">
                  ✕
                </button>
              </div>
              <StatsPanel
                mode={mode}
                statistics={statistics}
                highlightAttempt={round.gameWon ? round.stageIndex + 1 : null}
                tripleWin={tripleWin}
                showPointLabels={mode === "cinco"}
              />
            </div>
          </div>
        )}

        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)}>
            {mode === "tres" ? (
              <>
                <div className="border-2 border-black bg-[#a8e6cf] p-4">
                  <h4 className="font-black uppercase text-sm mb-2">Como Pistaza, en solitario</h4>
                  <p className="text-xs font-medium text-black/70">
                    Es el juego de la radio, pero sin rival: tres pistas de difícil a fácil, tú contra
                    la canción del día.
                  </p>
                </div>
                <div className="border-2 border-black bg-[#f5f1e8] p-4">
                  <h4 className="font-black uppercase text-sm mb-2">Melodía, verso, fragmento</h4>
                  <p className="text-xs font-medium text-black/70">
                    Primero oyes solo la melodía. Si no, un verso. Si no, un trozo de la canción.
                    Solo ves la pista actual.
                  </p>
                </div>
                <div className="border-2 border-black bg-[#f5f1e8] p-4">
                  <h4 className="font-black uppercase text-sm mb-2">Adivina o pasa</h4>
                  <p className="text-xs font-medium text-black/70">
                    Elige una canción del catálogo o pulsa Pasar. Pasar en la última pista es perder.
                    🟩 acierto · 🟥 fallo · ⬜ pasaste · ⬛ no la usaste.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="border-2 border-black bg-[#a8e6cf] p-4">
                  <h4 className="font-black uppercase text-sm mb-2">Como La Pista de Pasapalabra</h4>
                  <p className="text-xs font-medium text-black/70">
                    Cinco pistas que se aclaran, de 5 puntos a 1. No hay pulsador ni rival: el duelo
                    es el share con tus amigos.
                  </p>
                </div>
                <div className="border-2 border-black bg-[#f5f1e8] p-4">
                  <h4 className="font-black uppercase text-sm mb-2">Cada audio, un momento distinto</h4>
                  <p className="text-xs font-medium text-black/70">
                    Un trozo del principio, un verso, otro tramo de la canción, el título dicho de
                    otra forma, y el estribillo. No es el mismo clip cada vez más largo.
                  </p>
                </div>
                <div className="border-2 border-black bg-[#f5f1e8] p-4">
                  <h4 className="font-black uppercase text-sm mb-2">Adivina o pasa</h4>
                  <p className="text-xs font-medium text-black/70">
                    Ganas al primer acierto. Si agotas las 5, se revela la canción. Acertar en la 1
                    vale 5 puntos; en la 5, vale 1.
                  </p>
                </div>
              </>
            )}
          </HowToPlayModal>
        )}
      </div>
    </div>
  );
}

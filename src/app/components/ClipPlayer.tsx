"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Song } from "@/app/data/songs";
import { getAudioSources } from "@/lib/audio";
import { amplitudeEvents } from "@/lib/amplitude";

export default function ClipPlayer({
  song,
  startSec,
  durationSec,
  disabled,
}: {
  song: Song;
  startSec: number;
  durationSec: number;
  disabled?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(false);
  const sourceIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);

  const audioSources = useMemo(() => getAudioSources(song), [song]);
  const currentAudioUrl = audioSources[sourceIndex] ?? audioSources[0] ?? "";
  const endSec = startSec + durationSec;

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    sourceIndexRef.current = 0;
    setSourceIndex(0);
    setAudioError(false);
    setIsPlaying(false);
    isPlayingRef.current = false;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = startSec;
    }
  }, [song.id, startSec, durationSec]);

  const clampToClip = (audio: HTMLAudioElement) => {
    if (audio.currentTime < startSec) {
      audio.currentTime = startSec;
    }
    if (audio.currentTime >= endSec - 0.04) {
      audio.currentTime = startSec;
    }
  };

  const playFromSource = async (index: number) => {
    const audio = audioRef.current;
    const source = audioSources[index];
    if (!audio || !source) return false;

    sourceIndexRef.current = index;
    setSourceIndex(index);
    if (audio.getAttribute("src") !== source) {
      audio.src = source;
      audio.load();
    }

    try {
      audio.currentTime = startSec;
      await audio.play();
      if (index > 0) {
        amplitudeEvents.audioFallbackUsed(song.displayName, index);
      }
      setAudioError(false);
      setIsPlaying(true);
      isPlayingRef.current = true;
      amplitudeEvents.playClicked(0);
      return true;
    } catch {
      return false;
    }
  };

  const handleFailure = async (fromIndex: number) => {
    for (let index = fromIndex + 1; index < audioSources.length; index++) {
      const played = await playFromSource(index);
      if (played) return;
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    setAudioError(true);
    amplitudeEvents.audioPlaybackFailed(song.displayName, fromIndex);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || disabled) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
      amplitudeEvents.pauseClicked(0);
      return;
    }
    void (async () => {
      const startIndex = sourceIndexRef.current;
      const played = await playFromSource(startIndex);
      if (!played) await handleFailure(startIndex);
    })();
  };

  return (
    <div className="mb-6">
      <audio
        key={`${song.id}-${startSec}-${durationSec}`}
        ref={audioRef}
        src={currentAudioUrl || undefined}
        preload="auto"
        onLoadedMetadata={() => {
          if (audioRef.current) audioRef.current.currentTime = startSec;
        }}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (!audio) return;
          clampToClip(audio);
        }}
        onError={() => {
          void (async () => {
            const next = sourceIndexRef.current + 1;
            if (next < audioSources.length) {
              if (isPlayingRef.current) {
                const played = await playFromSource(next);
                if (!played) await handleFailure(next);
              } else {
                sourceIndexRef.current = next;
                setSourceIndex(next);
              }
              return;
            }
            setIsPlaying(false);
            isPlayingRef.current = false;
            setAudioError(true);
          })();
        }}
      />
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          disabled={disabled || audioError || audioSources.length === 0}
          className={`w-16 h-16 flex items-center justify-center text-2xl border-4 border-black font-black transition-all ${
            disabled || audioError || audioSources.length === 0
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
            {audioError || audioSources.length === 0
              ? "Audio no disponible"
              : isPlaying
                ? "● Reproduciendo"
                : "Presiona play"}
          </p>
          <p className="text-[10px] font-bold text-black/40 uppercase tracking-wide mt-1">
            Clip de {durationSec}s
          </p>
        </div>
      </div>
      {audioError && (
        <div className="mt-4 border-4 border-black bg-[#ffd700] p-4 text-center">
          <p className="text-sm font-black uppercase mb-2">No hemos podido cargar el audio</p>
          <button
            type="button"
            onClick={() => {
              setAudioError(false);
              sourceIndexRef.current = 0;
              setSourceIndex(0);
              void (async () => {
                const played = await playFromSource(0);
                if (!played) await handleFailure(0);
              })();
            }}
            className="px-4 py-2 bg-white border-4 border-black font-black uppercase text-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Reintentar audio
          </button>
        </div>
      )}
    </div>
  );
}

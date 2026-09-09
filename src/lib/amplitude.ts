import * as amplitude from '@amplitude/analytics-browser';
import type { GameMode } from '@/lib/game-modes';

// Inicializar Amplitude
let isInitialized = false;
let currentMode: GameMode = 'classic';

export const setAnalyticsMode = (mode: GameMode) => {
  currentMode = mode;
};

export const initAmplitude = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    
    if (apiKey) {
      amplitude.init(apiKey, undefined, {
        defaultTracking: {
          pageViews: true,
          sessions: true,
          formInteractions: false,
          fileDownloads: false,
        },
      });
      isInitialized = true;

      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get("utm_source");
      const utmMedium = params.get("utm_medium");
      const utmCampaign = params.get("utm_campaign");
      if (utmSource || utmMedium || utmCampaign) {
        trackEvent("landing_with_utm", {
          utm_source: utmSource || "",
          utm_medium: utmMedium || "",
          utm_campaign: utmCampaign || "",
        });
      }

      console.log('📊 Amplitude inicializado');
    } else {
      console.warn('⚠️ NEXT_PUBLIC_AMPLITUDE_API_KEY no está configurado');
    }
  }
};

// Eventos personalizados
export const trackEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
  if (isInitialized) {
    amplitude.track(eventName, { mode: currentMode, ...properties });
  }
};

// Eventos específicos del juego
export const amplitudeEvents = {
  // Usuario clica en play
  playClicked: (elapsedTime: number) => {
    trackEvent('play_clicked', {
      elapsed_time: elapsedTime,
      action: 'play_audio',
    });
  },

  // Usuario pausa
  pauseClicked: (elapsedTime: number) => {
    trackEvent('pause_clicked', {
      elapsed_time: elapsedTime,
      action: 'pause_audio',
    });
  },

  // Usuario clica en una canción del dropdown
  songSelected: (songName: string, fromSearch: boolean) => {
    trackEvent('song_selected', {
      song_name: songName,
      from_search: fromSearch,
      action: 'select_song',
    });
  },

  // Usuario clica en enviar
  submitClicked: (attemptNumber: number, elapsedTime: number, songName: string) => {
    trackEvent('submit_clicked', {
      attempt_number: attemptNumber,
      elapsed_time: elapsedTime.toFixed(2),
      song_name: songName,
      action: 'submit_guess',
    });
  },

  // Usuario adivina correctamente
  gameWon: (attempts: number, elapsedTime: number, songName: string) => {
    trackEvent('game_won', {
      attempts,
      elapsed_time: elapsedTime.toFixed(2),
      song_name: songName,
      outcome: 'win',
    });
  },

  // Usuario pierde
  gameLost: (attempts: number, elapsedTime: number, correctSong: string) => {
    trackEvent('game_lost', {
      attempts,
      elapsed_time: elapsedTime.toFixed(2),
      correct_song: correctSong,
      outcome: 'lose',
    });
  },

  // Usuario clica en compartir
  shareClicked: (attempts: number, won: boolean, shareMethod: 'native' | 'clipboard' | 'whatsapp') => {
    trackEvent('share_clicked', {
      attempts,
      won,
      share_method: shareMethod,
      action: 'share_results',
    });
  },

  // Usuario abre el tutorial
  tutorialOpened: () => {
    trackEvent('tutorial_opened', {
      action: 'open_tutorial',
    });
  },

  // Usuario abre estadísticas
  statsOpened: () => {
    trackEvent('stats_opened', {
      action: 'open_stats',
    });
  },

  // Usuario resetea el juego
  gameReset: () => {
    trackEvent('game_reset', {
      action: 'reset_game',
    });
  },

  // Usuario expande una pista
  clueExpanded: (clueType: string, attemptNumber: number) => {
    trackEvent('clue_expanded', {
      clue_type: clueType,
      attempt_number: attemptNumber,
      action: 'expand_clue',
    });
  },

  audioPlaybackFailed: (songName: string, sourceIndex: number) => {
    trackEvent('audio_playback_failed', {
      song_name: songName,
      source_index: sourceIndex,
      action: 'audio_error',
    });
  },

  audioFallbackUsed: (songName: string, sourceIndex: number) => {
    trackEvent('audio_fallback_used', {
      song_name: songName,
      source_index: sourceIndex,
      action: 'audio_fallback',
    });
  },

  modeSelected: (mode: GameMode, fromMode?: GameMode) => {
    trackEvent('mode_selected', {
      mode,
      from_mode: fromMode || '',
      action: 'select_mode',
    });
  },

  stageViewed: (stage: number) => {
    trackEvent('stage_viewed', {
      stage,
      action: 'view_stage',
    });
  },

  stageSkipped: (stage: number) => {
    trackEvent('stage_skipped', {
      stage,
      action: 'skip_stage',
    });
  },

  guessSubmitted: (stage: number, songName: string) => {
    trackEvent('guess_submitted', {
      stage,
      song_name: songName,
      action: 'submit_guess',
    });
  },

  tripleWin: (gameDate: string) => {
    trackEvent('triple_win', {
      game_date: gameDate,
      action: 'triple_win',
    });
  },
};

export default amplitude;


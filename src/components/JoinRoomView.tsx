'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { useTranslations } from 'next-intl';
import { Loader2, LogIn } from 'lucide-react';

const POLL_MS = 800;

export default function JoinRoomView() {
  const t = useTranslations('joinRoom');
  const { joinRoom, getRoom, roomData, roomCode, setGameMode, setMyPlayerName, myPlayerName, startQuiz, clearMultiplayerError } = useQuiz();
  const [code, setCode] = useState('');
  const playerCount = roomData?.players?.filter(Boolean).length ?? 0;
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasJoined = !!roomCode && !!roomData;

  // Once joined: if category is set, we can start; else poll until it is
  useEffect(() => {
    if (!hasJoined || !roomData) return;
    if (roomData.category) {
      // Start the quiz
      startQuiz(roomData.category);
      return;
    }
    // Poll until category is set
    const poll = () => {
      getRoom().then((r) => {
        if (r?.category) {
          startQuiz(r.category);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      });
    };
    poll();
    pollRef.current = setInterval(poll, POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [hasJoined, roomData, getRoom, startQuiz]);

  const handleJoin = async () => {
    setError(null);
    clearMultiplayerError();
    setJoining(true);
    const result = await joinRoom(code);
    setJoining(false);
    if (!result.ok) {
      setError(result.error || t('failedToJoin'));
    }
  };

  const handleBack = () => {
    setGameMode(null);
    setCode('');
    setError(null);
  };

  // Not yet joined: show form
  if (!hasJoined) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">{t('joinRoom')}</h2>
          <p className="text-dark-200 text-sm md:text-base">
            {t('enterCode')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="join-room-name" className="block text-sm text-dark-200 mb-2">
            {t('yourName')}
          </label>
          <input
            id="join-room-name"
            type="text"
            value={myPlayerName ?? ''}
            onChange={(e) => setMyPlayerName(e.target.value || null)}
            placeholder={t('yourNamePlaceholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-light-300 bg-white focus:border-primary focus:outline-none text-dark-300 placeholder:text-dark-100 min-h-[3rem]"
            maxLength={32}
            aria-label={t('yourName')}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="e.g. ABC123"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-light-300 focus:border-primary focus:outline-none font-mono text-lg tracking-widest"
            maxLength={6}
            aria-label={t('roomCode')}
          />
          <button
            onClick={handleJoin}
            disabled={joining || code.length < 4}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {joining ? t('joining') : t('join')}
          </button>
        </div>

        <div className="mt-6">
          <button onClick={handleBack} className="text-sm text-dark-200 hover:text-primary underline">
            {t('backToModeSelection')}
          </button>
        </div>
      </div>
    );
  }

  // Joined, waiting for host to pick category
  if (!roomData?.category) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="w-32 h-32 text-primary animate-spin mb-4" />
        <p className="text-dark-200 text-center min-w-0 max-w-full">{t('waitingForP1')}</p>
        <p className="text-sm text-dark-100 mt-2 text-center">{t('room')}: {roomCode}</p>
        <p className="text-sm text-dark-200 mt-1 text-center">{t('playersCount', { count: playerCount })}</p>
      </div>
    );
  }

  // Category is set; startQuiz was called from useEffect. Render a brief loading until Quiz switches to QuizRun
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="w-32 h-32 text-primary animate-spin mb-4" />
      <p className="text-dark-200 text-center min-w-0 max-w-full">{t('startingQuiz')}</p>
    </div>
  );
}

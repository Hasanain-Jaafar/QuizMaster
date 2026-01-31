'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { useTranslations } from 'next-intl';
import { Copy, Check, Loader2, ArrowRight, Users } from 'lucide-react';

const POLL_MS = 2000;

export default function CreateRoomView() {
  const t = useTranslations('createRoom');
  const {
    createRoom,
    roomCode,
    roomData,
    getRoom,
    setGameMode,
    setCreateRoomContinued,
    setMyPlayerName,
    myPlayerName,
    clearMultiplayerError,
    multiplayerError,
  } = useQuiz();
  const playerCount = roomData?.players?.filter(Boolean).length ?? 0;
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (roomCode) return;
    if (startedRef.current) return;
    startedRef.current = true;
    queueMicrotask(() => {
      clearMultiplayerError();
      setCreating(true);
      createRoom().finally(() => setCreating(false));
    });
  }, [roomCode, createRoom, clearMultiplayerError]);

  useEffect(() => {
    if (!roomCode) return;
    getRoom();
    const id = setInterval(() => getRoom(), POLL_MS);
    return () => clearInterval(id);
  }, [roomCode, getRoom]); 

  const copyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (creating && !roomCode) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="w-32 h-32 text-primary animate-spin mb-4" />
        <p className="text-dark-200 text-center min-w-0 max-w-full">{t('creatingRoom')}</p>
      </div>
    );
  }

  if (!roomCode) {
    return (
      <div className="w-full max-w-xl mx-auto py-12 px-4 text-center">
        {multiplayerError && (
          <p className="text-red-600 text-sm mb-4" role="alert">{multiplayerError}</p>
        )}
        <p className="text-dark-200 mb-4">{t('pickCategoryAndStart')}</p>
        <button
          type="button"
          onClick={() => setGameMode('solo')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90"
        >
          <ArrowRight className="w-5 h-5" />
          {t('pickCategoryAndStart')}
        </button>
        <button
          type="button"
          onClick={() => setGameMode(null)}
          className="block mt-4 text-sm text-dark-200 hover:text-primary underline"
        >
          {t('cancel')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">{t('roomCreated')}</h2>
        <p className="text-dark-200 text-sm md:text-base">
          {t('shareCode')}
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="create-room-name" className="block text-sm font-medium text-dark-300 mb-2">
          {t('yourName')}
        </label>
        <input
          id="create-room-name"
          type="text"
          value={myPlayerName ?? ''}
          onChange={(e) => setMyPlayerName(e.target.value || null)}
          placeholder={t('yourNamePlaceholder')}
          className="w-full px-4 py-3 rounded-xl border-2 border-light-300 bg-white focus:border-primary focus:outline-none text-dark-300 placeholder:text-dark-100 min-h-12"
          maxLength={32}
          aria-label={t('yourName')}
        />
      </div>

      <div className="p-6 bg-white rounded-xl border-2 border-primary/20 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm text-dark-200">{t('roomCode')}</p>
          <p className="text-sm font-medium text-dark-300 flex items-center gap-1">
            <Users className="w-4 h-4 text-primary" />
            {t('playersCount', { count: playerCount })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-lg"
            aria-label={`${t('roomCode')}: ${roomCode}`}
          >
            {roomCode}
          </span>
          <button
            type="button"
            onClick={copyCode}
            className="p-2 rounded-lg border border-light-300 hover:bg-primary/5 hover:border-primary/30 flex items-center gap-2"
            aria-label={t('copy')}
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-dark-200" />}
            <span className="text-sm font-medium">{copied ? t('copied') : t('copy')}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setCreateRoomContinued(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          {t('pickCategoryAndStart')}
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => setGameMode(null)}
          className="text-sm text-dark-200 hover:text-primary underline"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}

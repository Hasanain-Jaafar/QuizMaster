'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { useTranslations } from 'next-intl';
import { User, Users, PlusCircle, LogIn } from 'lucide-react';

export default function ModeSelection() {
  const t = useTranslations('modeSelection');
  const { setGameMode, multiplayerError, clearMultiplayerError } = useQuiz();

  return (
    <div className="w-full max-w-4xl mx-auto min-w-0">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">{t('chooseGameMode')}</h2>
        <p className="text-dark-200 text-sm md:text-base">
          {t('subtitle')}
        </p>
      </div>

      {multiplayerError && (
        <div
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start justify-between gap-2"
          role="alert"
        >
          <span>{multiplayerError}</span>
          <button
            type="button"
            onClick={clearMultiplayerError}
            className="shrink-0 px-2 py-1 text-amber-600 hover:bg-amber-100 rounded"
            aria-label={t('dismiss')}
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
        <button
          onClick={() => setGameMode('solo')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-start transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">{t('solo')}</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">{t('playSolo')}</div>
          </div>
        </button>

        <button
          onClick={() => setGameMode('2player')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-start transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">{t('2player')}</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">{t('twoPlayersSameDevice')}</div>
          </div>
        </button>

        <button
          onClick={() => setGameMode('create_room')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-start transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">{t('createRoom')}</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">{t('createRoomDesc')}</div>
          </div>
        </button>

        <button
          onClick={() => setGameMode('join_room')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-start transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">{t('joinRoom')}</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">{t('joinRoomDesc')}</div>
          </div>
        </button>
      </div>
    </div>
  );
}

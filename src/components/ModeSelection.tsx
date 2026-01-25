'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { User, Users, PlusCircle, LogIn } from 'lucide-react';

export default function ModeSelection() {
  const { setGameMode, multiplayerError, clearMultiplayerError } = useQuiz();

  return (
    <div className="w-full max-w-4xl mx-auto min-w-0">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">Choose a game mode</h2>
        <p className="text-dark-200 text-sm md:text-base">
          Play alone or compete with a friend in 2-Player or via Room codes.
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
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
        <button
          onClick={() => setGameMode('solo')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">Solo</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">Play by yourself</div>
          </div>
        </button>

        <button
          onClick={() => setGameMode('2player')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">2-Player</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">Two players, same device</div>
          </div>
        </button>

        <button
          onClick={() => setGameMode('create_room')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">Create Room</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">Create a room and share the code</div>
          </div>
        </button>

        <button
          onClick={() => setGameMode('join_room')}
          className="w-full min-w-0 p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] overflow-hidden"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-dark-300 truncate">Join Room</div>
            <div className="text-sm text-dark-200 wrap-break-word line-clamp-2">Enter a room code to join</div>
          </div>
        </button>
      </div>
    </div>
  );
}

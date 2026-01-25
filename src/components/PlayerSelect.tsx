'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { User } from 'lucide-react';

export default function PlayerSelect() {
  const { setSelectedPlayer, setGameMode } = useQuiz();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">Which player are you?</h2>
        <p className="text-dark-200 text-sm md:text-base">
          Scores are saved separately for each player.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <button
          onClick={() => setSelectedPlayer('player1')}
          className="p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] flex-1"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-dark-300">Player 1</div>
            <div className="text-sm text-dark-200">I&apos;m Player 1</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedPlayer('player2')}
          className="p-4 md:p-5 rounded-xl text-left transition-all flex items-center gap-4 border-2 bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md active:scale-[0.99] flex-1"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-dark-300">Player 2</div>
            <div className="text-sm text-dark-200">I&apos;m Player 2</div>
          </div>
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setGameMode(null)}
          className="text-sm text-dark-200 hover:text-primary underline"
        >
          ← Back to mode selection
        </button>
      </div>
    </div>
  );
}

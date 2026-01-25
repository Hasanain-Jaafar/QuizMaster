'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { Loader2, LogIn } from 'lucide-react';

const POLL_MS = 2500;

export default function JoinRoomView() {
  const { joinRoom, getRoom, roomData, roomCode, setGameMode, startQuiz, clearMultiplayerError } = useQuiz();
  const [code, setCode] = useState('');
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
      setError(result.error || 'Failed to join');
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
          <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">Join a room</h2>
          <p className="text-dark-200 text-sm md:text-base">
            Enter the 6-character code from the host.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="e.g. ABC123"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-light-300 focus:border-primary focus:outline-none font-mono text-lg tracking-widest"
            maxLength={6}
            aria-label="Room code"
          />
          <button
            onClick={handleJoin}
            disabled={joining || code.length < 4}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {joining ? 'Joining…' : 'Join'}
          </button>
        </div>

        <div className="mt-6">
          <button onClick={handleBack} className="text-sm text-dark-200 hover:text-primary underline">
            ← Back to mode selection
          </button>
        </div>
      </div>
    );
  }

  // Joined, waiting for host to pick category
  if (!roomData?.category) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-dark-200 text-center">Waiting for Player 1 to start…</p>
        <p className="text-sm text-dark-100 mt-2">Room: {roomCode}</p>
      </div>
    );
  }

  // Category is set; startQuiz was called from useEffect. Render a brief loading until Quiz switches to QuizRun
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-12">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-dark-200">Starting quiz…</p>
    </div>
  );
}

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QuizState, QuizQuestion, GameMode, SelectedPlayer, RoomData, PlayerScores } from '@/types/quiz';
import { getCategories, getQuestionsByCategory } from '@/data/quizData';

const API = '/.netlify/functions';

interface QuizContextType extends QuizState {
  totalQuestions: number;
  questions: QuizQuestion[];
  selectAnswer: (optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  restartQuiz: () => void;
  goToQuestion: (index: number) => void;
  showResults: () => void;
  isAnswerLocked: (questionIndex: number) => boolean;
  reviewMode: boolean;
  enterReviewMode: () => void;
  exitReviewMode: () => void;
  selectedCategory: string | null;
  categories: { id: string; name: string; count: number }[];
  startQuiz: (categoryId: string) => void;
  // Multiplayer
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;
  selectedPlayer: SelectedPlayer | null;
  setSelectedPlayer: (p: SelectedPlayer | null) => void;
  roomCode: string | null;
  roomData: RoomData | null;
  setRoomCode: (c: string | null) => void;
  setRoomData: (d: RoomData | null) => void;
  createRoomContinued: boolean;
  setCreateRoomContinued: (v: boolean) => void;
  playerScores: PlayerScores | null;
  multiplayerError: string | null;
  clearMultiplayerError: () => void;
  createRoom: () => Promise<{ ok: true } | { ok: false; error: string }>;
  joinRoom: (code: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  getRoom: () => Promise<RoomData | null>;
  updateRoom: (updates: Partial<Pick<RoomData, 'category' | 'status' | 'player1' | 'player2'>>) => Promise<boolean>;
  saveScore: (playerId: 'player1' | 'player2', score: number, total: number, category: string) => Promise<boolean>;
  loadScores: () => Promise<boolean>;
  resetToModeSelection: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: [] as number[],
    quizCompleted: false,
  });
  const [reviewMode, setReviewMode] = useState(false);
  // Multiplayer
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [createRoomContinued, setCreateRoomContinued] = useState(false);
  const [playerScores, setPlayerScores] = useState<PlayerScores | null>(null);
  const [multiplayerError, setMultiplayerError] = useState<string | null>(null);

  const categories = getCategories();

  const clearMultiplayerError = useCallback(() => setMultiplayerError(null), []);

  const createRoom = useCallback(async (): Promise<{ ok: true } | { ok: false; error: string }> => {
    try {
      const res = await fetch(`${API}/create-room`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = res.status === 404 ? 'Multiplayer requires Netlify or netlify dev.' : (data?.error || 'Failed to create room');
        setMultiplayerError(msg);
        return { ok: false, error: msg };
      }
      const code = data?.code as string;
      if (!code) return { ok: false, error: 'Invalid response' };
      setRoomCode(code);
      const getRes = await fetch(`${API}/get-room?code=${encodeURIComponent(code)}`);
      const room = await getRes.json().catch(() => null);
      if (room && room.code) {
        setRoomData(room);
      } else {
        setRoomData({
          code,
          player1: null,
          player2: null,
          category: null,
          status: 'waiting',
          createdAt: Date.now(),
        });
      }
      return { ok: true };
    } catch (e) {
      const msg = 'Multiplayer requires Netlify or netlify dev.';
      setMultiplayerError(msg);
      return { ok: false, error: msg };
    }
  }, []);

  const joinRoom = useCallback(async (code: string): Promise<{ ok: true } | { ok: false; error: string }> => {
    const c = code.toUpperCase().trim();
    if (!c) return { ok: false, error: 'Enter a room code' };
    try {
      const res = await fetch(`${API}/get-room?code=${encodeURIComponent(c)}`);
      const data = await res.json().catch(() => ({}));
      if (res.status === 404) {
        setMultiplayerError('Room not found');
        return { ok: false, error: 'Room not found' };
      }
      if (!res.ok) {
        const msg = res.status === 404 ? 'Multiplayer requires Netlify or netlify dev.' : (data?.error || 'Failed to join');
        setMultiplayerError(msg);
        return { ok: false, error: msg };
      }
      if (!data?.code) return { ok: false, error: 'Invalid response' };
      setRoomCode(data.code);
      setRoomData(data);
      return { ok: true };
    } catch (e) {
      const msg = 'Multiplayer requires Netlify or netlify dev.';
      setMultiplayerError(msg);
      return { ok: false, error: msg };
    }
  }, []);

  const getRoom = useCallback(async (): Promise<RoomData | null> => {
    if (!roomCode) return null;
    try {
      const res = await fetch(`${API}/get-room?code=${encodeURIComponent(roomCode)}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data?.code) {
        setRoomData(data);
        return data;
      }
      return null;
    } catch {
      return null;
    }
  }, [roomCode]);

  const updateRoom = useCallback(async (updates: Partial<Pick<RoomData, 'category' | 'status' | 'player1' | 'player2'>>): Promise<boolean> => {
    if (!roomCode) return false;
    try {
      const res = await fetch(`${API}/update-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: roomCode, ...updates }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setRoomData(data);
        return true;
      }
      if (res.status === 404) setMultiplayerError('Multiplayer requires Netlify or netlify dev.');
      return false;
    } catch (e) {
      setMultiplayerError('Multiplayer requires Netlify or netlify dev.');
      return false;
    }
  }, [roomCode]);

  const saveScore = useCallback(async (playerId: 'player1' | 'player2', score: number, total: number, category: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/save-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, score, total, category }),
      });
      if (res.status === 404) setMultiplayerError('Multiplayer requires Netlify or netlify dev.');
      return res.ok;
    } catch (e) {
      setMultiplayerError('Multiplayer requires Netlify or netlify dev.');
      return false;
    }
  }, []);

  const loadScores = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/get-scores`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPlayerScores(data);
        return true;
      }
      if (res.status === 404) setMultiplayerError('Multiplayer requires Netlify or netlify dev.');
      return false;
    } catch (e) {
      setMultiplayerError('Multiplayer requires Netlify or netlify dev.');
      return false;
    }
  }, []);

  const resetToModeSelection = useCallback(() => {
    setGameMode(null);
    setSelectedPlayer(null);
    setRoomCode(null);
    setRoomData(null);
    setCreateRoomContinued(false);
    setPlayerScores(null);
    setMultiplayerError(null);
    setSelectedCategory(null);
    setCurrentQuestions([]);
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: [],
      quizCompleted: false,
    });
    setReviewMode(false);
  }, []);

  const startQuiz = (categoryId: string) => {
    const filtered = getQuestionsByCategory(categoryId);
    setCurrentQuestions(filtered);
    setSelectedCategory(categoryId);
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: Array(filtered.length).fill(-1),
      quizCompleted: false,
    });
    setReviewMode(false);
  };

  const selectAnswer = (optionIndex: number) => {
    if (quizState.quizCompleted || quizState.userAnswers[quizState.currentQuestionIndex] !== -1) {
      return;
    }

    setQuizState(prev => {
      const newUserAnswers = [...prev.userAnswers];
      newUserAnswers[prev.currentQuestionIndex] = optionIndex;
      const isCorrect = optionIndex === currentQuestions[prev.currentQuestionIndex].correctAnswer;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      return {
        ...prev,
        userAnswers: newUserAnswers,
        score: newScore,
      };
    });
  };

  const nextQuestion = () => {
    if (quizState.currentQuestionIndex < currentQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const prevQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const showResults = () => {
    // Check if all questions are answered
    const allAnswered = quizState.userAnswers.every(answer => answer !== -1);
    
    if (allAnswered) {
      setQuizState(prev => ({
        ...prev,
        quizCompleted: true,
      }));
    } else {
      // Optional: Show a message that all questions need to be answered
      alert('Please answer all questions before viewing results.');
    }
  };

  const restartQuiz = resetToModeSelection;

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < currentQuestions.length) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: index,
      }));
    }
  };

  const isAnswerLocked = (questionIndex: number) => {
    // Answers are locked if quiz is completed, in review mode, or if the question has already been answered
    return quizState.quizCompleted || reviewMode || quizState.userAnswers[questionIndex] !== -1;
  };

  const enterReviewMode = () => {
    setReviewMode(true);
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: 0, // Start from first question
    }));
  };

  const exitReviewMode = () => {
    setReviewMode(false);
  };

  const value: QuizContextType = {
    ...quizState,
    totalQuestions: currentQuestions.length,
    questions: currentQuestions,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    restartQuiz,
    goToQuestion,
    showResults,
    isAnswerLocked,
    reviewMode,
    enterReviewMode,
    exitReviewMode,
    selectedCategory,
    categories,
    startQuiz,
    gameMode,
    setGameMode,
    selectedPlayer,
    setSelectedPlayer,
    roomCode,
    roomData,
    setRoomCode,
    setRoomData,
    createRoomContinued,
    setCreateRoomContinued,
    playerScores,
    multiplayerError,
    clearMultiplayerError,
    createRoom,
    joinRoom,
    getRoom,
    updateRoom,
    saveScore,
    loadScores,
    resetToModeSelection,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
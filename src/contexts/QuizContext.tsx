"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import { useLocale } from "next-intl";
import {
  QuizState,
  QuizQuestion,
  GameMode,
  SelectedPlayer,
  RoomData,
  PlayerScores,
  ROOM_MAX_PLAYERS,
} from "@/types/quiz";
import { getCategories, getQuestionsByCategory } from "@/data/quizData";
import {
  recordQuizCompleted,
  getDueQuestions,
  makeQuestionKey,
} from "@/utils/learningStorage";

const API = "/.netlify/functions";

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
  // Practice/Learning
  practiceMode: boolean;
  practiceMeta?: { source: "due" | "category_mistakes" | "recent_mistakes" };
  startPracticeDue: () => void;
  startPracticeRecentMistakes: () => void;
  // Multiplayer
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;
  selectedPlayer: SelectedPlayer | null;
  setSelectedPlayer: (p: SelectedPlayer | null) => void;
  roomCode: string | null;
  roomData: RoomData | null;
  setRoomCode: (c: string | null) => void;
  setRoomData: (d: RoomData | null) => void;
  myPlayerIndex: number | null;
  myPlayerName: string | null;
  setMyPlayerName: (name: string | null) => void;
  createRoomContinued: boolean;
  setCreateRoomContinued: (v: boolean) => void;
  playerScores: PlayerScores | null;
  multiplayerError: string | null;
  clearMultiplayerError: () => void;
  createRoom: () => Promise<{ ok: true } | { ok: false; error: string }>;
  joinRoom: (
    code: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  getRoom: () => Promise<RoomData | null>;
  updateRoom: (updates: {
    category?: string;
    status?: RoomData["status"];
    playerIndex?: number;
    player?: RoomData["players"][0];
  }) => Promise<boolean>;
  saveScore: (
    playerIndex: number,
    score: number,
    total: number,
    category: string,
    name?: string
  ) => Promise<boolean>;
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
  // Practice/Learning
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceMeta, setPracticeMeta] = useState<
    { source: "due" | "category_mistakes" | "recent_mistakes" } | undefined
  >(undefined);
  // Multiplayer
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(
    null
  );
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState<number | null>(null);
  const [myPlayerName, setMyPlayerName] = useState<string | null>(null);
  const [createRoomContinued, setCreateRoomContinued] = useState(false);
  const [playerScores, setPlayerScores] = useState<PlayerScores | null>(null);
  const [multiplayerError, setMultiplayerError] = useState<string | null>(null);

  const locale = useLocale();
  const categories = useMemo(() => getCategories(locale), [locale]);

  const clearMultiplayerError = useCallback(
    () => setMultiplayerError(null),
    []
  );

  const createRoom = useCallback(async (): Promise<
    { ok: true } | { ok: false; error: string }
  > => {
    try {
      const res = await fetch(`${API}/create-room`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          res.status === 404
            ? "Multiplayer requires Netlify or netlify dev."
            : data?.error || "Failed to create room";
        setMultiplayerError(msg);
        return { ok: false, error: msg };
      }
      const code = data?.code as string;
      if (!code) return { ok: false, error: "Invalid response" };
      setRoomCode(code);
      const getRes = await fetch(
        `${API}/get-room?code=${encodeURIComponent(code)}`
      );
      const room = await getRes.json().catch(() => null);
      if (room && room.code) {
        setRoomData(room);
      } else {
        setRoomData({
          code,
          players: Array(ROOM_MAX_PLAYERS).fill(null),
          category: null,
          status: "waiting",
          createdAt: Date.now(),
        });
      }
      setMyPlayerIndex(0);
      return { ok: true };
    } catch (e) {
      const msg = "Multiplayer requires Netlify or netlify dev.";
      setMultiplayerError(msg);
      return { ok: false, error: msg };
    }
  }, []);

  const joinRoom = useCallback(
    async (
      code: string
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      const c = code.toUpperCase().trim();
      if (!c) return { ok: false, error: "Enter a room code" };
      try {
        const res = await fetch(
          `${API}/get-room?code=${encodeURIComponent(c)}`
        );
        const data = await res.json().catch(() => ({}));
        if (res.status === 404) {
          setMultiplayerError("Room not found");
          return { ok: false, error: "Room not found" };
        }
        if (!res.ok) {
          const msg =
            res.status === 404
              ? "Multiplayer requires Netlify or netlify dev."
              : data?.error || "Failed to join";
          setMultiplayerError(msg);
          return { ok: false, error: msg };
        }
        if (!data?.code) return { ok: false, error: "Invalid response" };
        const players: RoomData["players"][0][] = Array.isArray(data.players)
          ? data.players
          : [];
        let slot = -1;
        for (let i = 1; i < ROOM_MAX_PLAYERS; i++) {
          if (players[i] == null) {
            slot = i;
            break;
          }
        }
        if (slot < 0) {
          setMultiplayerError("Room is full");
          return { ok: false, error: "Room is full" };
        }
        setRoomCode(data.code);
        setRoomData(data);
        const name =
          (typeof myPlayerName === "string" ? myPlayerName.trim() : "") ||
          undefined;
        const updateRes = await fetch(`${API}/update-room`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: data.code,
            playerIndex: slot,
            player: { score: -1, total: 0, name },
          }),
        });
        const updated = await updateRes.json().catch(() => null);
        if (updateRes.ok && updated?.code) {
          setRoomData(updated);
        }
        setMyPlayerIndex(slot);
        return { ok: true };
      } catch (e) {
        const msg = "Multiplayer requires Netlify or netlify dev.";
        setMultiplayerError(msg);
        return { ok: false, error: msg };
      }
    },
    [myPlayerName]
  );

  const getRoom = useCallback(async (): Promise<RoomData | null> => {
    if (!roomCode) return null;
    try {
      const url = `${API}/get-room?code=${encodeURIComponent(
        roomCode
      )}&t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
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

  const updateRoom = useCallback(
    async (updates: {
      category?: string;
      status?: RoomData["status"];
      playerIndex?: number;
      player?: RoomData["players"][0];
    }): Promise<boolean> => {
      if (!roomCode) return false;
      try {
        const res = await fetch(`${API}/update-room`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: roomCode, ...updates }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data) {
          setRoomData(data);
          return true;
        }
        if (res.status === 404)
          setMultiplayerError("Multiplayer requires Netlify or netlify dev.");
        return false;
      } catch (e) {
        setMultiplayerError("Multiplayer requires Netlify or netlify dev.");
        return false;
      }
    },
    [roomCode]
  );

  const saveScore = useCallback(
    async (
      playerIndex: number,
      score: number,
      total: number,
      category: string,
      name?: string
    ): Promise<boolean> => {
      const playerId = `player${playerIndex}`;
      try {
        const res = await fetch(`${API}/save-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, score, total, category, name }),
        });
        if (res.status === 404)
          setMultiplayerError("Multiplayer requires Netlify or netlify dev.");
        return res.ok;
      } catch (e) {
        setMultiplayerError("Multiplayer requires Netlify or netlify dev.");
        return false;
      }
    },
    []
  );

  const loadScores = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/get-scores`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPlayerScores(data);
        return true;
      }
      if (res.status === 404)
        setMultiplayerError("Multiplayer requires Netlify or netlify dev.");
      return false;
    } catch (e) {
      setMultiplayerError("Multiplayer requires Netlify or netlify dev.");
      return false;
    }
  }, []);

  const resetToModeSelection = useCallback(() => {
    const doReset = () => {
      setGameMode(null);
      setSelectedPlayer(null);
      setRoomCode(null);
      setRoomData(null);
      setMyPlayerIndex(null);
      setMyPlayerName(null);
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
    };
    if (
      (gameMode === "create_room" || gameMode === "join_room") &&
      roomCode &&
      myPlayerIndex != null
    ) {
      updateRoom({ playerIndex: myPlayerIndex, player: null }).finally(doReset);
    } else {
      doReset();
    }
  }, [gameMode, roomCode, myPlayerIndex, updateRoom]);

  const startQuiz = useCallback(
    (categoryId: string) => {
      const filtered = getQuestionsByCategory(categoryId, locale);
      setCurrentQuestions(filtered);
      setSelectedCategory(categoryId);
      setQuizState({
        currentQuestionIndex: 0,
        score: 0,
        userAnswers: Array(filtered.length).fill(-1),
        quizCompleted: false,
      });
      setReviewMode(false);
    },
    [locale]
  );

  const selectAnswer = (optionIndex: number) => {
    if (
      quizState.quizCompleted ||
      quizState.userAnswers[quizState.currentQuestionIndex] !== -1
    ) {
      return;
    }

    setQuizState((prev) => {
      const newUserAnswers = [...prev.userAnswers];
      newUserAnswers[prev.currentQuestionIndex] = optionIndex;
      const isCorrect =
        optionIndex ===
        currentQuestions[prev.currentQuestionIndex].correctAnswer;
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
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const prevQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const showResults = () => {
    // Check if all questions are answered
    const allAnswered = quizState.userAnswers.every((answer) => answer !== -1);

    if (allAnswered) {
      setQuizState((prev) => ({
        ...prev,
        quizCompleted: true,
      }));
    } else {
      // Optional: Show a message that all questions need to be answered
      alert("Please answer all questions before viewing results.");
    }
  };

  const restartQuiz = resetToModeSelection;

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < currentQuestions.length) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: index,
      }));
    }
  };

  const isAnswerLocked = (questionIndex: number) => {
    // Answers are locked if quiz is completed, in review mode, or if the question has already been answered
    return (
      quizState.quizCompleted ||
      reviewMode ||
      quizState.userAnswers[questionIndex] !== -1
    );
  };

  const enterReviewMode = () => {
    setReviewMode(true);
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: 0, // Start from first question
    }));
  };

  const exitReviewMode = () => {
    setReviewMode(false);
  };

  // Practice mode functions
  const startPracticeDue = useCallback(() => {
    const dueKeys = getDueQuestions(Date.now());
    if (dueKeys.length === 0) return;

    // Parse keys and collect questions
    const practiceQuestions: QuizQuestion[] = [];
    dueKeys.forEach((key) => {
      const [keyLocale, keyCategoryId, questionIdStr] = key.split(":");
      if (keyLocale !== locale) return; // Skip other locales

      const questionId = parseInt(questionIdStr, 10);
      const categoryQuestions = getQuestionsByCategory(keyCategoryId, locale);
      const question = categoryQuestions.find((q) => q.id === questionId);
      if (question) {
        practiceQuestions.push(question);
      }
    });

    if (practiceQuestions.length === 0) return;

    setCurrentQuestions(practiceQuestions);
    setSelectedCategory("practice-due"); // Special category marker
    setPracticeMode(true);
    setPracticeMeta({ source: "due" });
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: Array(practiceQuestions.length).fill(-1),
      quizCompleted: false,
    });
    setReviewMode(false);
  }, [locale]);

  const startPracticeRecentMistakes = useCallback(() => {
    if (
      !selectedCategory ||
      selectedCategory.startsWith("practice-") ||
      currentQuestions.length === 0
    )
      return;

    // Build list of missed questions from current quiz
    const missedQuestions = currentQuestions.filter((_, index) => {
      const userAnswer = quizState.userAnswers[index];
      return (
        userAnswer !== -1 &&
        userAnswer !== currentQuestions[index].correctAnswer
      );
    });

    if (missedQuestions.length === 0) return;

    setCurrentQuestions(missedQuestions);
    setSelectedCategory(`practice-recent:${selectedCategory}`);
    setPracticeMode(true);
    setPracticeMeta({ source: "recent_mistakes" });
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: Array(missedQuestions.length).fill(-1),
      quizCompleted: false,
    });
    setReviewMode(false);
  }, [selectedCategory, currentQuestions, quizState.userAnswers]);

  // Record quiz completion to learning storage
  useEffect(() => {
    if (!quizState.quizCompleted || practiceMode) return;
    if (!selectedCategory || selectedCategory.startsWith("practice-")) return;
    if (currentQuestions.length === 0) return;

    recordQuizCompleted({
      locale,
      categoryId: selectedCategory,
      questions: currentQuestions,
      userAnswers: quizState.userAnswers,
      score: quizState.score,
    });
  }, [
    quizState.quizCompleted,
    practiceMode,
    selectedCategory,
    currentQuestions,
    quizState.userAnswers,
    quizState.score,
    locale,
  ]);

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
    practiceMode,
    practiceMeta,
    startPracticeDue,
    startPracticeRecentMistakes,
    gameMode,
    setGameMode,
    selectedPlayer,
    setSelectedPlayer,
    roomCode,
    roomData,
    setRoomCode,
    setRoomData,
    myPlayerIndex,
    myPlayerName,
    setMyPlayerName,
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
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

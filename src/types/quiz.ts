export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  userAnswers: number[];
  quizCompleted: boolean;
}

export type GameMode = 'solo' | '2player' | 'create_room' | 'join_room' | null;
export type SelectedPlayer = 'player1' | 'player2';

export interface RoomData {
  code: string;
  player1: { score: number; total: number } | null;
  player2: { score: number; total: number } | null;
  category: string | null;
  status: 'waiting' | 'started' | 'completed';
  createdAt: number;
}

export interface ScoreHistoryEntry {
  score: number;
  total: number;
  category: string;
  date: string;
}

export interface PlayerScores {
  player1?: { history: ScoreHistoryEntry[] };
  player2?: { history: ScoreHistoryEntry[] };
}
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

export interface RoomPlayer {
  score: number;
  total: number;
  name?: string;
}

export interface RoomData {
  code: string;
  player1: RoomPlayer | null;
  player2: RoomPlayer | null;
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
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

export const ROOM_MAX_PLAYERS = 6;

export interface RoomData {
  code: string;
  /** Up to ROOM_MAX_PLAYERS slots; host is 0, joiners fill 1..5. */
  players: (RoomPlayer | null)[];
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
  player0?: { history: ScoreHistoryEntry[] };
  player1?: { history: ScoreHistoryEntry[] };
  player2?: { history: ScoreHistoryEntry[] };
  player3?: { history: ScoreHistoryEntry[] };
  player4?: { history: ScoreHistoryEntry[] };
  player5?: { history: ScoreHistoryEntry[] };
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  category: string;
  timestamp: number;
  percentage: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
}
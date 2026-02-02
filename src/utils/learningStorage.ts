import { toLocalISODateString, addDays } from './date';
import type { QuizQuestion } from '@/types/quiz';

const STORAGE_KEY = 'quiz:learning:v1';
const MAX_MISTAKES = 500;

export interface MistakeItem {
  ease: number;
  intervalDays: number;
  dueAt: number;
  lastAnsweredAt: number;
  wrongCount: number;
  rightCount: number;
}

export interface LearningStats {
  quizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  bestCategoryByAccuracy: { categoryId: string; accuracy: number } | null;
  streak: {
    current: number;
    longest: number;
    lastPlayedDate: string; // "YYYY-MM-DD"
  };
}

export interface LearningState {
  version: number;
  stats: LearningStats;
  mistakes: Record<string, MistakeItem>;
}

/**
 * Generate stable question key
 */
export function makeQuestionKey(locale: string, categoryId: string, questionId: number): string {
  return `${locale}:${categoryId}:${questionId}`;
}

/**
 * Load learning state from localStorage
 */
export function loadLearningState(): LearningState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw) as LearningState;
    if (parsed.version !== 1) return getDefaultState();

    return parsed;
  } catch {
    return getDefaultState();
  }
}

/**
 * Save learning state to localStorage
 */
export function saveLearningState(state: LearningState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save learning state:', e);
  }
}

/**
 * Get default/empty learning state
 */
function getDefaultState(): LearningState {
  return {
    version: 1,
    stats: {
      quizzesCompleted: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      bestCategoryByAccuracy: null,
      streak: {
        current: 0,
        longest: 0,
        lastPlayedDate: '',
      },
    },
    mistakes: {},
  };
}

/**
 * Record quiz completion
 */
export function recordQuizCompleted(params: {
  locale: string;
  categoryId: string;
  questions: QuizQuestion[];
  userAnswers: number[];
  score: number;
}): LearningState {
  const state = loadLearningState();
  const { locale, categoryId, questions, userAnswers, score } = params;

  const totalQuestions = questions.length;
  const correct = score;
  const today = toLocalISODateString(new Date());

  // Update stats
  state.stats.quizzesCompleted++;
  state.stats.totalQuestionsAnswered += totalQuestions;
  state.stats.totalCorrect += correct;

  // Update streak
  const lastPlayed = state.stats.streak.lastPlayedDate;
  if (lastPlayed === today) {
    // Already played today, no change
  } else if (lastPlayed === toLocalISODateString(addDays(new Date(), -1))) {
    // Played yesterday, increment streak
    state.stats.streak.current++;
    state.stats.streak.longest = Math.max(state.stats.streak.longest, state.stats.streak.current);
    state.stats.streak.lastPlayedDate = today;
  } else if (lastPlayed === '') {
    // First quiz ever
    state.stats.streak.current = 1;
    state.stats.streak.longest = 1;
    state.stats.streak.lastPlayedDate = today;
  } else {
    // Streak broken
    state.stats.streak.current = 1;
    state.stats.streak.lastPlayedDate = today;
  }

  // Update best category
  const categoryAccuracy = (correct / totalQuestions) * 100;
  if (!state.stats.bestCategoryByAccuracy || categoryAccuracy > state.stats.bestCategoryByAccuracy.accuracy) {
    state.stats.bestCategoryByAccuracy = { categoryId, accuracy: categoryAccuracy };
  }

  // Record each answer for spaced repetition
  questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const questionKey = makeQuestionKey(locale, categoryId, question.id);

    recordAnswer(state, questionKey, isCorrect);
  });

  // Cap mistakes to MAX_MISTAKES
  const mistakeKeys = Object.keys(state.mistakes);
  if (mistakeKeys.length > MAX_MISTAKES) {
    // Sort by lastAnsweredAt, keep newest MAX_MISTAKES
    const sorted = mistakeKeys.sort((a, b) => state.mistakes[b].lastAnsweredAt - state.mistakes[a].lastAnsweredAt);
    const toRemove = sorted.slice(MAX_MISTAKES);
    toRemove.forEach((key) => delete state.mistakes[key]);
  }

  saveLearningState(state);
  return state;
}

/**
 * Record a single answer (for spaced repetition)
 */
function recordAnswer(state: LearningState, questionKey: string, correct: boolean): void {
  const now = Date.now();
  let item = state.mistakes[questionKey];

  if (!item) {
    // New mistake item
    item = {
      ease: 2.5,
      intervalDays: 1,
      dueAt: now,
      lastAnsweredAt: now,
      wrongCount: 0,
      rightCount: 0,
    };
    state.mistakes[questionKey] = item;
  }

  item.lastAnsweredAt = now;

  if (!correct) {
    // Wrong answer
    item.wrongCount++;
    item.intervalDays = 1;
    item.ease = Math.max(1.3, item.ease - 0.2);
    item.dueAt = addDays(new Date(now), 1).getTime();
  } else {
    // Correct answer
    item.rightCount++;
    item.ease = Math.min(3.0, item.ease + 0.05);
    item.intervalDays = Math.max(2, Math.round(item.intervalDays * item.ease));
    item.dueAt = addDays(new Date(now), item.intervalDays).getTime();
  }
}

/**
 * Get due question keys
 */
export function getDueQuestions(now = Date.now()): string[] {
  const state = loadLearningState();
  return Object.keys(state.mistakes).filter((key) => state.mistakes[key].dueAt <= now);
}

/**
 * Get due count
 */
export function getDueCount(now = Date.now()): number {
  return getDueQuestions(now).length;
}

/**
 * Reset all progress (for user-initiated reset)
 */
export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

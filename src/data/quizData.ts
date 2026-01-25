import type { QuizQuestion } from '@/types/quiz';
import { quizQuestionsEn } from './quizData.en';
import { quizQuestionsSv } from './quizData.sv';
import { quizQuestionsAr } from './quizData.ar';

const datasets: Record<string, QuizQuestion[]> = {
  en: quizQuestionsEn,
  sv: quizQuestionsSv,
  ar: quizQuestionsAr,
};

function getQuestions(locale: string): QuizQuestion[] {
  return datasets[locale] ?? datasets.en;
}

export type CategoryInfo = { id: string; name: string; count: number };

export function getCategories(locale: string): CategoryInfo[] {
  const questions = getQuestions(locale);
  const map = new Map<string, number>();
  for (const q of questions) {
    const c = q.category;
    map.set(c, (map.get(c) || 0) + 1);
  }
  const list: CategoryInfo[] = Array.from(map.entries())
    .map(([name, count]) => ({ id: name, name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [
    { id: 'all', name: 'All Categories', count: questions.length },
    ...list,
  ];
}

export function getQuestionsByCategory(categoryId: string, locale: string): QuizQuestion[] {
  const questions = getQuestions(locale);
  if (categoryId === 'all') return [...questions];
  return questions.filter((q) => q.category === categoryId);
}

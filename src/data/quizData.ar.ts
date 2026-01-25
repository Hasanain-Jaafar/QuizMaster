import type { QuizQuestion } from '@/types/quiz';
import { quizQuestionsEn } from './quizData.en';
import { arOverrides } from './ar-overrides';

/** Arabic: all questions use arOverrides. */
export const quizQuestionsAr: QuizQuestion[] = quizQuestionsEn.map((q, i) => {
  const ov = arOverrides[i];
  if (ov) return { ...q, question: ov.question, options: ov.options, explanation: ov.explanation };
  return q;
});

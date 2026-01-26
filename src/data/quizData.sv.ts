import type { QuizQuestion } from '@/types/quiz';
import { quizQuestionsEn } from './quizData.en';
import { svOverrides } from './sv-overrides';

/** Swedish: questions 1–50 and 99–118 use svOverrides; 51–98 use English placeholders. */
export const quizQuestionsSv: QuizQuestion[] = quizQuestionsEn.map((q, i) => {
  const ov = svOverrides[i];
  if (ov) return { ...q, question: ov.question, options: ov.options, explanation: ov.explanation };
  return q;
});

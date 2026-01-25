'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { QuizState } from '@/types/quiz';
import { QuizQuestion } from '@/types/quiz';
import { getCategories, getQuestionsByCategory } from '@/data/quizData';

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

  const categories = getCategories();

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

  const restartQuiz = () => {
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

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizState } from '@/types/quiz';
import { quizQuestions } from '@/data/quizData';

interface QuizContextType extends QuizState {
  totalQuestions: number;
  questions: typeof quizQuestions;
  selectAnswer: (optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  restartQuiz: () => void;
  goToQuestion: (index: number) => void;
  showResults: () => void; // New function to show results
  isAnswerLocked: (questionIndex: number) => boolean; // Check if answer is locked
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: Array(quizQuestions.length).fill(-1), // -1 means not answered
    quizCompleted: false,
  });

  const selectAnswer = (optionIndex: number) => {
    if (quizState.quizCompleted || quizState.userAnswers[quizState.currentQuestionIndex] !== -1) {
      return;
    }

    setQuizState(prev => {
      const newUserAnswers = [...prev.userAnswers];
      newUserAnswers[prev.currentQuestionIndex] = optionIndex;
      
      const isCorrect = optionIndex === quizQuestions[prev.currentQuestionIndex].correctAnswer;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      
      return {
        ...prev,
        userAnswers: newUserAnswers,
        score: newScore,
      };
    });
  };

  const nextQuestion = () => {
    if (quizState.currentQuestionIndex < quizQuestions.length - 1) {
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
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: Array(quizQuestions.length).fill(-1),
      quizCompleted: false,
    });
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < quizQuestions.length) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: index,
      }));
    }
  };

  const isAnswerLocked = (questionIndex: number) => {
    // Answers are locked if quiz is completed or if the question has already been answered
    return quizState.quizCompleted || quizState.userAnswers[questionIndex] !== -1;
  };

  const value: QuizContextType = {
    ...quizState,
    totalQuestions: quizQuestions.length,
    questions: quizQuestions,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    restartQuiz,
    goToQuestion,
    showResults,
    isAnswerLocked,
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
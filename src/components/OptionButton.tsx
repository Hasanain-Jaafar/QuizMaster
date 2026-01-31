// src/components/OptionButton.tsx
'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface OptionButtonProps {
  option: string;
  index: number;
}

export default function OptionButton({ option, index }: OptionButtonProps) {
  const t = useTranslations('optionButton');
  const { 
    currentQuestionIndex, 
    userAnswers, 
    selectAnswer, 
    questions, 
    quizCompleted,
    isAnswerLocked
  } = useQuiz();
  
  const [isHovered, setIsHovered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];
  const isSelected = userAnswer === index;
  const isCorrect = index === currentQuestion.correctAnswer;
  const isAnswered = userAnswer !== -1;

  // Color states based on answer status
  const getButtonStyles = () => {
    const baseStyles = 'w-full p-4 md:p-6 rounded-xl md:rounded-xl text-start transition-all duration-300 border-2 flex items-center gap-3 md:gap-4 shadow-sm hover:shadow-md active:scale-[0.98] ';
    
    if (!isAnswered) {
      return baseStyles + (
        isSelected 
          ? 'bg-primary/10 text-primary border-primary shadow-primary/20 hover:bg-primary/15'
          : 'bg-white text-dark-300 border-light-300 hover:border-secondary hover:bg-light-100'
      );
    }
    
    if (isSelected) {
      return baseStyles + (
        isCorrect 
          ? 'bg-green-50 text-green-800 border-green-300 shadow-green-100/50'
          : 'bg-red-50 text-red-800 border-red-300 shadow-red-100/50'
      );
    }
    
    if (isCorrect) {
      return baseStyles + 'bg-green-50 text-green-800 border-green-300 shadow-green-100/50';
    }
    
    return baseStyles + 'bg-light-100 text-dark-100 border-light-300 opacity-80';
  };

  const getIndicatorStyles = () => {
    const baseStyles = 'flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-semibold transition-colors duration-300 ';
    
    if (!isAnswered) {
      return baseStyles + (
        isSelected 
          ? 'bg-primary text-white'
          : 'bg-light-300 text-dark-200'
      );
    }
    
    if (isSelected) {
      return baseStyles + (
        isCorrect 
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      );
    }
    
    if (isCorrect) {
      return baseStyles + 'bg-green-100 text-green-700 border border-green-300';
    }
    
    return baseStyles + 'bg-light-200 text-dark-100';
  };

  const getStatusIcon = () => {
    if (!isAnswered) return null;
    
    if (isSelected) {
      return isCorrect 
        ? <Check className="w-5 h-5 md:w-6 md:h-6" />
        : <X className="w-5 h-5 md:w-6 md:h-6" />;
    }
    
    if (isCorrect) {
      return <Check className="w-5 h-5 md:w-6 md:h-6" />;
    }
    
    return null;
  };

  const getStatusText = () => {
    if (!isAnswered) return null;
    
    if (isSelected) {
      return (
        <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold ${
          isCorrect 
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {isCorrect ? t('correct') : t('incorrect')}
        </span>
      );
    }
    
    if (isCorrect) {
      return (
        <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs md:text-sm font-semibold">
          {t('correctAnswer')}
        </span>
      );
    }
    
    return null;
  };

  const getLetter = () => {
    const letters = ['A', 'B', 'C'];
    return letters[index];
  };
  const isLocked = isAnswerLocked(currentQuestionIndex);
  return (
    <button
    onClick={() => {
      if (!isLocked) {
        selectAnswer(index);
      }
    }}
    disabled={isLocked || quizCompleted}
     
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={getButtonStyles()}
      aria-label={`Option ${getLetter()}: ${option}${isAnswered ? (isSelected ? (isCorrect ? ' - Correct answer' : ' - Incorrect answer') : (isCorrect ? ' - This is the correct answer' : '')) : ''}`}
    >
      <div className={getIndicatorStyles()}>
        {getStatusIcon() || getLetter()}
      </div>
      
      <div className="flex-1 text-start">
        <span className="text-sm md:text-base font-medium">{option}</span>
      </div>
      
      {getStatusText()}
      
      {/* Hover indicator */}
      {!isAnswered && isHovered && !isSelected && (
        <div className="absolute inset-0 border-2 border-secondary rounded-xl md:rounded-xl pointer-events-none animate-pulse-subtle" />
      )}
    </button>
  );
}
'use client';

import { useQuiz } from '@/contexts/QuizContext';

export default function ProgressBar() {
  const { currentQuestionIndex, totalQuestions, userAnswers } = useQuiz();
  const answeredCount = userAnswers.filter((a) => a !== -1).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span>{answeredCount}/{totalQuestions} answered · {Math.round(progress)}%</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAnswered = userAnswers[index] !== -1;
          const isCurrent = index === currentQuestionIndex;
          return (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-sm transition-all duration-300 ${
                isAnswered
                  ? 'bg-green-500'
                  : isCurrent
                    ? 'bg-primary'
                    : 'bg-gray-200'
              }`}
              title={isAnswered ? `Question ${index + 1} answered` : `Question ${index + 1} not answered`}
            />
          );
        })}
      </div>
    </div>
  );
}
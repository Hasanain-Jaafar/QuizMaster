// src/components/ScoreDisplay.tsx - Add this new section after the stats grid
'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { Trophy, Sparkles, CheckCircle, XCircle, Eye, RotateCcw } from 'lucide-react';

export default function ScoreDisplay() {
  const { score, totalQuestions, quizCompleted, questions, userAnswers, goToQuestion } = useQuiz();
  
  if (!quizCompleted) return null;

  const percentage = Math.round((score / totalQuestions) * 100);
  const correctAnswers = score;
  const incorrectAnswers = totalQuestions - score;
  
  const getPerformance = () => {
    if (percentage >= 90) return { 
      message: "Perfect Score! 🎯", 
      color: "from-primary to-secondary",
      bgColor: "bg-gradient-to-br from-primary/5 to-secondary/5",
      borderColor: "border-primary/30",
      icon: "🏆",
      feedback: "Outstanding performance! You're a quiz master!"
    };
    if (percentage >= 70) return { 
      message: "Great Job! ✨", 
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      icon: "🌟",
      feedback: "Excellent work! You really know your stuff!"
    };
    if (percentage >= 50) return { 
      message: "Good Effort! 👍", 
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      icon: "💪",
      feedback: "Good job! Keep learning and you'll improve even more!"
    };
    return { 
      message: "Keep Learning! 📚", 
      color: "from-accent to-amber-700",
      bgColor: "bg-gradient-to-br from-accent/5 to-amber-50",
      borderColor: "border-accent/20",
      icon: "🎯",
      feedback: "Every attempt is a learning opportunity. Try again!"
    };
  };

  const performance = getPerformance();

  return (
    <div className={`${performance.bgColor} rounded-2xl md:rounded-3xl p-6 md:p-8 border ${performance.borderColor} animate-slide-up`}>
      <div className="text-center space-y-6 md:space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="relative flex flex-col items-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 ${performance.color} rounded-full shadow-xl mb-4 md:mb-6 bg-blue-400`}>
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-300">
              Quiz Completed!
            </h2>
            <p className={`text-xl md:text-2xl font-semibold ${performance.color} bg-clip-text text-transparent mb-2`}>
              {performance.message}
            </p>
            <p className="text-dark-200 mx-auto">
              {performance.feedback}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* ... (keep existing stats cards) */}
        </div>

        {/* Question Review Grid - NEW SECTION */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-dark-300">Question Review</h3>
            <p className="text-dark-200 text-sm">Click any question to review your answer</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const isAnswered = userAnswer !== -1;
              
              return (
                <button
                  key={question.id}
                  onClick={() => goToQuestion(index)}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                    isAnswered
                      ? isCorrect
                        ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                        : 'bg-red-50 border border-red-200 hover:bg-red-100'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                  title={`Question ${index + 1}: ${isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isAnswered
                      ? isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium">
                      Q{index + 1}
                    </span>
                    <div className={`flex items-center gap-1 text-xs ${
                      isAnswered
                        ? isCorrect
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'text-gray-500'
                    }`}>
                      {isAnswered ? (
                        <>
                          {isCorrect ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{isCorrect ? 'Correct' : 'Wrong'}</span>
                        </>
                      ) : (
                        <span>Unanswered</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Answer indicator */}
                  {isAnswered && (
                    <div className="text-xs text-dark-300 font-medium">
                      Your: {String.fromCharCode(65 + userAnswer)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-light-100 rounded-lg border border-light-300">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-dark-300">Correct Answer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-dark-300">Incorrect Answer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span className="text-sm text-dark-300">Not Answered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => goToQuestion(0)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Review All Questions
          </button>
          
          <button
            onClick={() => {
              // Restart quiz function
              window.location.reload(); // Or use your restart function
            }}
            className="px-6 py-3   bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
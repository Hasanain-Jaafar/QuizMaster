'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, RotateCcw, SkipBack, SkipForward, List, Trophy } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function QuestionNavigation() {
  const t = useTranslations('quizNav');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const navRef = useRef<HTMLDivElement>(null);
  const { 
    currentQuestionIndex, 
    totalQuestions, 
    nextQuestion, 
    prevQuestion, 
    restartQuiz,
    goToQuestion,
    showResults,
    userAnswers,
    quizCompleted,
    questions,
    reviewMode,
    exitReviewMode
  } = useQuiz();
  
  const [showQuestionList, setShowQuestionList] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (showQuestionList && navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowQuestionList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQuestionList]);

  const allQuestionsAnswered = userAnswers.every(answer => answer !== -1);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const answeredCount = userAnswers.filter(answer => answer !== -1).length;

  return (
    <div className="relative w-full" ref={navRef}>
      <div className="w-full bg-white rounded-xl md:rounded-xl shadow-lg p-4 border border-light-300">
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          {/* Navigation Buttons */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0 || (quizCompleted && !reviewMode)}
              className="flex-1 sm:flex-none px-4 py-3 bg-light-100 hover:bg-light-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              aria-label={t('previous')}
            >
              {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              <span className="hidden xs:inline text-sm font-medium">{t('previous')}</span>
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg" dir="ltr">
              <span className="font-bold text-primary text-sm">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-dark-200 text-sm">/ {totalQuestions}</span>
            </div>
            
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1 || (quizCompleted && !reviewMode)}
              className="flex-1 sm:flex-none px-4 py-3 bg-light-100 hover:bg-light-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              aria-label={t('next')}
            >
              <span className="hidden xs:inline text-sm font-medium">{t('next')}</span>
              {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Navigation Buttons */}
          <div className="flex items-center gap-2">
                        
            <button
              onClick={() => setShowQuestionList(!showQuestionList)}
              className="p-3 hover:bg-light-100 rounded-lg transition-colors relative"
              aria-label="Show question list"
            >
              <List className="w-5 h-5 text-dark-200" />
              {/* Answered indicator on list button */}
              <span className="absolute -top-1 -end-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {answeredCount}
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Back to Results Button - Show when in review mode */}
            {reviewMode && (
              <button
                onClick={exitReviewMode}
                className="flex-1 sm:flex-none px-4 py-3 bg-primary text-white hover:opacity-90 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Trophy className="w-5 h-5" />
                <span className="text-sm">{t('backToResults')}</span>
              </button>
            )}
            
            {/* Show Results Button - Show on last question when all are answered */}
            {isLastQuestion && !quizCompleted && allQuestionsAnswered && !reviewMode && (
              <button
                onClick={showResults}
                className="flex-1 sm:flex-none px-4 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-semibold">{t('showResults')}</span>
              </button>
            )}
            
            {/* Alternative: Show "Complete All Questions" when not all answered on last question */}
            {isLastQuestion && !quizCompleted && !allQuestionsAnswered && !reviewMode && (
              <div className="flex-1 sm:flex-none px-4 py-3 bg-amber-50 text-amber-800 rounded-sm border border-amber-200 flex items-center justify-center gap-2 font-medium">
                <span className="text-sm font-semibold">
                  {t('answeredCount', { answered: answeredCount, total: totalQuestions })}
                </span>
              </div>
            )}
            
            {/* Restart Button - Always visible */}
            <button
              onClick={restartQuiz}
              className="flex-1 sm:flex-none px-4 py-3 bg-primary text-white hover:opacity-90 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
            >
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm">{t('restart')}</span>
              </button>
          </div>
        </div>

        {/* Progress Message for Last Question */}
        {isLastQuestion && !quizCompleted && (
          <div className={`mt-4 p-3 rounded-sm border text-center ${
            allQuestionsAnswered
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <p className="text-sm font-medium">
              {allQuestionsAnswered ? (
                <>
                  <span className="font-bold">{t('allQuestionsAnswered')}</span>
                  <span className="ml-2">{t('allAnsweredClick')}</span>
                </>
              ) : (
                <>
                  <span className="font-bold">📝 {t('questionsLeft', { count: totalQuestions - answeredCount })}</span>
                  <span className="ml-2">{t('answerAllToSee')}</span>
                </>
              )}
            </p>
          </div>
        )}

      </div>

      {/* Question List Dropdown */}
      {showQuestionList && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-light-300 p-4 z-10 animate-fade-in max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-dark-300">{t('allQuestions')}</h4>
            <div className="text-sm text-dark-200">
              {answeredCount}/{totalQuestions} {t('answeredShort')}
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 min-w-0">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const isAnswered = userAnswers[index] !== -1;
              const isCorrect = isAnswered && userAnswers[index] === questions[index].correctAnswer;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    goToQuestion(index);
                    setShowQuestionList(false);
                  }}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all relative group ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-white'
                      : isAnswered
                        ? isCorrect
                          ? 'bg-green-100 hover:bg-green-200 text-green-800'
                          : 'bg-red-100 hover:bg-red-200 text-red-800'
                        : 'bg-light-100 hover:bg-light-200 text-dark-300'
                  }`}
                  title={`${index + 1}${isAnswered ? ` - ${isCorrect ? t('correct') : t('incorrect')}` : ` - ${t('notAnswered')}`}`}
                >
                  <span className="font-bold text-sm">{index + 1}</span>
                  {isAnswered && (
                    <div className={`w-2 h-2 rounded-full ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-dark-300 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    {t('question')} {index + 1}
                    {isAnswered && (
                      <div className={`text-xs ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                        {isCorrect ? `✓ ${t('correct')}` : `✗ ${t('incorrect')}`}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-light-300">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <span className="text-dark-300">{t('current')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-dark-300">{t('correct')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-dark-300">{t('incorrect')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
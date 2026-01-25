// src/components/Quiz.tsx
'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { useTranslations } from 'next-intl';
import CategorySelection from './CategorySelection';
import ModeSelection from './ModeSelection';
import PlayerSelect from './PlayerSelect';
import CreateRoomView from './CreateRoomView';
import JoinRoomView from './JoinRoomView';
import OptionButton from './OptionButton';
import ProgressBar from './ProgressBar';
import QuestionNavigation from './QuestionNavigation';
import ScoreDisplay from './ScoreDisplay';
import { HelpCircle, CheckCircle, Clock, AlertCircle, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Quiz() {
  const {
    quizCompleted,
    reviewMode,
    selectedCategory,
    gameMode,
    selectedPlayer,
    roomCode,
    createRoomContinued,
  } = useQuiz();

  // Not in a quiz: show mode selection, player select, create/join room, or category selection
  if (selectedCategory === null) {
    if (gameMode === null) return <ModeSelection />;
    if (gameMode === '2player' && selectedPlayer === null) return <PlayerSelect />;
    if (gameMode === 'create_room') {
      if (roomCode && createRoomContinued) return <CategorySelection />;
      return <CreateRoomView />;
    }
    if (gameMode === 'join_room') return <JoinRoomView />;
    // solo, or 2player with selectedPlayer
    return <CategorySelection />;
  }

  // Show score display only if quiz is completed and not in review mode
  if (quizCompleted && !reviewMode) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 md:space-y-8">
          <ScoreDisplay />
          <div className="flex justify-center">
            <QuestionNavigation />
          </div>
        </div>
      </div>
    );
  }

  return <QuizRun key={selectedCategory} />;
}

function QuizRun() {
  const t = useTranslations('quiz');
  const { currentQuestionIndex, questions, userAnswers, quizCompleted, isAnswerLocked, totalQuestions, reviewMode } = useQuiz();
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer: only run the interval when quiz is in progress (not completed).
  // setState runs inside the interval callback (async), not in the effect body.
  useEffect(() => {
    if (quizCompleted) return;

    const id = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];
  const hasAnswered = userAnswer !== -1;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = userAnswers.every(answer => answer !== -1);
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="bg-linear-to-r from-primary/5 via-secondary/5 to-primary/10 rounded-xl md:rounded-xl p-4 md:p-6 border border-primary/20">
          {reviewMode && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium text-center">
                {t('reviewModeNote')}
              </p>
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-300">
                {t('questionOf', { current: currentQuestionIndex + 1, total: questions.length })}
                {isLastQuestion && <span className="ml-2 text-accent">{t('lastQuestion')}</span>}
              </h1>
              <p className="text-dark-200 mt-1 text-sm md:text-base">
                {reviewMode ? t('reviewAnswer') : t('selectAnswer')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-light-300 shadow-sm">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span className="font-semibold text-dark-300 text-sm md:text-base">
                  {formatTime(timeSpent)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg shadow-md">
                <span className="font-bold text-sm md:text-base">
                  {userAnswers.filter(a => a !== -1).length}/{questions.length}
                </span>
                <span className="text-sm md:text-base">{t('answered')}</span>
              </div>
              
              {/* Last Question Indicator */}
              {isLastQuestion && (
                <div className="flex items-center gap-2 px-3 py-2 bg-accent/20 text-accent rounded-lg border border-accent/30">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('finalQuestion')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-6">
            <ProgressBar />
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="bg-white rounded-xl md:rounded-xl shadow-lg p-4 md:p-8 lg:p-10 border border-light-300">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-6 md:mb-10">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border  border-primary/40 rounded-lg shadow-md bg-primary/10${
                  isLastQuestion ? 'bg-gradient-accent' : 'bg-gradient-primary'
                }`}>
                  <span className=" text-primary  font-bold text-lg md:text-xl">
                    {currentQuestionIndex + 1}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs md:text-sm font-semibold rounded-sm">
                    {t('question')} {currentQuestionIndex + 1}
                  </span>
                  <span className="px-3 py-1.5 bg-secondary/10 text-primary text-xs md:text-sm font-semibold rounded-sm">
                    {t('options3')}
                  </span>
                  {hasAnswered && (
                    <span className={`px-2 py-1 ${
                      userAnswer === currentQuestion.correctAnswer
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    } text-xs md:text-sm font-semibold rounded-sm`}>
                      {userAnswer === currentQuestion.correctAnswer ? t('correct') : t('incorrect')}
                    </span>
                  )}
                  {isLastQuestion && (
                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs md:text-sm font-semibold rounded-lg">
                      {t('finalQuestion')}
                    </span>
                  )}
                </div>
              </div>
              
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-dark-300 leading-tight">
                {currentQuestion.question}
              </h2>
            </div>
            
            <button 
              className="p-2 hover:bg-light-100 rounded-lg transition-colors ml-2"
              aria-label="Help information"
            >
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-dark-100" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6 md:mb-10">
            {currentQuestion.options.map((option, index) => {
              // Check if answer is locked for this question
              const isLocked = isAnswerLocked(currentQuestionIndex);
              
              return (
                <div key={index} className="relative">
                  <OptionButton option={option} index={index} />
                  {isLocked && hasAnswered && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Answer Feedback Section */}
          {hasAnswered && (
            <div className={`mt-6 md:mt-10 p-4 md:p-6 rounded-xl md:rounded-xl border ${
              userAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            } animate-fade-in`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className={`p-2 md:p-3 rounded-lg ${
                  userAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-100'
                    : 'bg-red-100'
                }`}>
                  {userAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-dark-300">
                      {userAnswer === currentQuestion.correctAnswer ? t('correct') : t('notQuiteRight')}
                    </h3>
                    {userAnswer !== currentQuestion.correctAnswer && (
                      <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-sm">
                        {t('tryAgain')}
                      </span>
                    )}
                  </div>
                  
                  {currentQuestion.explanation && (
                    <>
                      <p className="text-dark-200 mb-3">
                        {userAnswer === currentQuestion.correctAnswer 
                          ? t('correctExplanation')
                          : t('incorrectExplanation')}
                      </p>
                      <div className="p-4 bg-white/50 rounded-lg border border-light-300">
                        <p className="text-dark-300 font-medium">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Last Question Message */}
          {isLastQuestion && allAnswered && !quizCompleted && (
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-xl md:rounded-xl border border-emerald-200 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-2">
                    {t('allAnswered')}
                  </h3>
                  <p className="text-emerald-700">
                    {t('showResultsPrompt', { total: totalQuestions })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <QuestionNavigation />
      </div>
    </div>
  );
}
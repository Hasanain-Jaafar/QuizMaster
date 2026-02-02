"use client";

import { useEffect, useRef, useState } from "react";
import { useQuiz } from "@/contexts/QuizContext";
import { ROOM_MAX_PLAYERS } from "@/types/quiz";
import { useTranslations } from "next-intl";
import {
  Trophy,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Loader2,
  Users,
  BookOpen,
} from "lucide-react";
import { getDueCount } from "@/utils/learningStorage";

const POLL_MS = 1000;

export default function ScoreDisplay() {
  const t = useTranslations("score");
  const tPractice = useTranslations("practice");
  const {
    score,
    totalQuestions,
    quizCompleted,
    questions,
    userAnswers,
    goToQuestion,
    enterReviewMode,
    restartQuiz,
    gameMode,
    selectedPlayer,
    selectedCategory,
    roomData,
    myPlayerIndex,
    myPlayerName,
    updateRoom,
    getRoom,
    saveScore,
    loadScores,
    playerScores,
    practiceMode,
    startPracticeDue,
    startPracticeRecentMistakes,
  } = useQuiz();

  const reportedRef = useRef(false);
  const savedRef = useRef(false);
  const [hadMultiplePlayers, setHadMultiplePlayers] = useState(false);
  const [dueCount, setDueCount] = useState(0);
  const playerCount = roomData?.players?.filter(Boolean).length ?? 0;

  // Update due count on mount and after quiz completion
  useEffect(() => {
    setDueCount(getDueCount());
  }, [quizCompleted]);
  useEffect(() => {
    if (playerCount >= 2) {
      queueMicrotask(() => setHadMultiplePlayers(true));
    }
  }, [playerCount]);

  // Room: report our score (by slot) once, with optional name
  useEffect(() => {
    if (!quizCompleted || reportedRef.current || !selectedCategory) return;
    if (gameMode !== "create_room" && gameMode !== "join_room") return;
    if (myPlayerIndex == null) return;
    const name = myPlayerName?.trim() || undefined;
    updateRoom({
      playerIndex: myPlayerIndex,
      player: { score, total: totalQuestions, name },
    }).finally(() => {
      reportedRef.current = true;
    });
  }, [
    quizCompleted,
    gameMode,
    selectedCategory,
    score,
    totalQuestions,
    myPlayerIndex,
    myPlayerName,
    updateRoom,
  ]);

  // Room: poll so we see the other player's result and detect if they leave or restart
  useEffect(() => {
    if (gameMode !== "create_room" && gameMode !== "join_room") return;
    getRoom();
    const id = setInterval(() => getRoom(), POLL_MS);
    return () => clearInterval(id);
  }, [gameMode, getRoom]);

  // 2-Player: save and load scores once (player1 -> index 0, player2 -> index 1)
  useEffect(() => {
    if (
      !quizCompleted ||
      savedRef.current ||
      gameMode !== "2player" ||
      !selectedPlayer ||
      !selectedCategory
    )
      return;
    const playerIndex = selectedPlayer === "player1" ? 0 : 1;
    // Don't pass name for 2-player mode (local multiplayer on same device)
    saveScore(playerIndex, score, totalQuestions, selectedCategory).finally(
      () => {
        loadScores().finally(() => {
          savedRef.current = true;
        });
      }
    );
  }, [
    quizCompleted,
    gameMode,
    selectedPlayer,
    selectedCategory,
    score,
    totalQuestions,
    saveScore,
    loadScores,
  ]);

  // Solo/Room: save to leaderboard with name
  useEffect(() => {
    if (!quizCompleted || savedRef.current) return;
    if (
      gameMode !== "solo" &&
      gameMode !== "create_room" &&
      gameMode !== "join_room"
    )
      return;
    if (!selectedCategory) return;

    // For solo mode, we can save anonymously or skip leaderboard
    // For room modes, use the player's name if available
    const name =
      gameMode === "create_room" || gameMode === "join_room"
        ? myPlayerName?.trim() || undefined
        : undefined; // Solo players won't appear on leaderboard without a name

    // Save with playerIndex 0 for solo, or actual index for room modes
    const playerIndex = myPlayerIndex ?? 0;
    saveScore(
      playerIndex,
      score,
      totalQuestions,
      selectedCategory,
      name
    ).finally(() => {
      savedRef.current = true;
    });
  }, [
    quizCompleted,
    gameMode,
    selectedCategory,
    score,
    totalQuestions,
    myPlayerIndex,
    myPlayerName,
    saveScore,
  ]);

  if (!quizCompleted) return null;

  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getPerformance = () => {
    if (percentage >= 90)
      return {
        messageKey: "perfectMessage" as const,
        feedbackKey: "perfectFeedback" as const,
        color: "from-primary to-secondary",
        bgColor: "bg-gradient-to-br from-primary/5 to-secondary/5",
        borderColor: "border-primary/30",
      };
    if (percentage >= 70)
      return {
        messageKey: "greatMessage" as const,
        feedbackKey: "greatFeedback" as const,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        borderColor: "border-green-200",
      };
    if (percentage >= 50)
      return {
        messageKey: "goodMessage" as const,
        feedbackKey: "goodFeedback" as const,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        borderColor: "border-blue-200",
      };
    return {
      messageKey: "keepMessage" as const,
      feedbackKey: "keepFeedback" as const,
      color: "from-accent to-amber-700",
      bgColor: "bg-gradient-to-br from-accent/5 to-amber-50",
      borderColor: "border-accent/20",
    };
  };

  const performance = getPerformance();
  const performanceMessage = t(`performance.${performance.messageKey}`);
  const performanceFeedback = t(`performance.${performance.feedbackKey}`);

  return (
    <div
      className={`${performance.bgColor} rounded-xl md:rounded-xl p-6 md:p-8 border ${performance.borderColor} animate-slide-up`}
    >
      <div className="text-center space-y-6 md:space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="relative flex flex-col items-center">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 ${performance.color} rounded-full shadow-xl mb-4 md:mb-6 bg-blue-400`}
            >
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-300">
              {t("quizCompleted")}
            </h2>
            <p
              className={`text-xl md:text-2xl font-semibold ${performance.color} bg-clip-text text-transparent mb-2`}
            >
              {performanceMessage}
            </p>
            <p className="text-dark-200 mx-auto">{performanceFeedback}</p>
          </div>
        </div>

        {/* Multiplayer: 2-Player comparison */}
        {gameMode === "2player" && (
          <div className="p-4 md:p-5 bg-white/60 rounded-xl border border-primary/20">
            <h3 className="flex items-center gap-2 font-semibold text-dark-300 mb-3">
              <Users className="w-5 h-5 text-primary" />
              {t("scores")}
            </h3>
            <p className="text-dark-200 mb-2">
              {t("yourScore")}{" "}
              <strong>
                {score}/{totalQuestions}
              </strong>
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                {t("player1Label")}{" "}
                {playerScores?.player0?.history?.length
                  ? `${playerScores.player0.history.slice(-1)[0].score}/${
                      playerScores.player0.history.slice(-1)[0].total
                    }`
                  : "—"}
              </span>
              <span>
                {t("player2Label")}{" "}
                {playerScores?.player1?.history?.length
                  ? `${playerScores.player1.history.slice(-1)[0].score}/${
                      playerScores.player1.history.slice(-1)[0].total
                    }`
                  : "—"}
              </span>
            </div>
          </div>
        )}

        {/* Multiplayer: Room comparison (up to 6 players) */}
        {(gameMode === "create_room" || gameMode === "join_room") && (
          <div className="p-4 md:p-5 bg-white/60 rounded-xl border border-primary/20">
            <h3 className="flex items-center gap-2 font-semibold text-dark-300 mb-3">
              <Users className="w-5 h-5 text-primary" />
              {t("roomResults")}
            </h3>
            {playerCount > 0 ? (
              <div>
                {hadMultiplePlayers && playerCount < 2 ? (
                  <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm font-medium mb-3">
                    {t("otherPlayerLeft")}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-4 text-sm">
                  {roomData?.players?.map((p, i) => {
                    if (p == null) return null;
                    const label = t("playerLabel", { n: i + 1 });
                    return (
                      <span key={i}>
                        <strong>{p.name ? `${p.name}:` : label}</strong>{" "}
                        {p.score >= 0 && p.total > 0
                          ? `${p.score}/${p.total}`
                          : "—"}
                      </span>
                    );
                  })}
                </div>
                {playerCount > 0 &&
                  roomData?.players?.some(
                    (p) => p != null && (p.score < 0 || p.total === 0)
                  ) && (
                    <p className="text-dark-200 flex items-center gap-2 mt-2 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {t("syncingResults")}
                    </p>
                  )}
              </div>
            ) : (
              <p className="text-dark-200 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("waitingForOtherPlayer")}
              </p>
            )}
          </div>
        )}

        {/* Continue Learning Section */}
        {!practiceMode &&
          selectedCategory &&
          !selectedCategory.startsWith("practice-") && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {tPractice("continuelearning")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {/* Practice missed questions from this quiz */}
                {questions.some(
                  (q, i) =>
                    userAnswers[i] !== -1 && userAnswers[i] !== q.correctAnswer
                ) && (
                  <button
                    type="button"
                    onClick={startPracticeRecentMistakes}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors text-sm border border-red-200 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {tPractice("practiceMissed")}
                  </button>
                )}

                {/* Practice due questions */}
                {dueCount > 0 && (
                  <button
                    type="button"
                    onClick={startPracticeDue}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium transition-colors text-sm border border-purple-200 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    {tPractice("practiceDue")} ({dueCount})
                  </button>
                )}
              </div>
            </div>
          )}

        {/* Question Review Grid */}
        <div className="pt-6 md:pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-2">
            <h3 className="text-lg md:text-xl font-bold text-dark-300">
              {t("questionReview")}
            </h3>
            <p className="text-dark-200 text-xs md:text-sm">
              {t("clickToReview")}
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const isAnswered = userAnswer !== -1;

              return (
                <button
                  key={question.id}
                  onClick={() => {
                    enterReviewMode();
                    goToQuestion(index);
                  }}
                  className={`p-2 md:p-4 rounded-lg md:rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 transition-all hover:scale-105 active:scale-95 ${
                    isAnswered
                      ? isCorrect
                        ? "bg-green-50 border border-green-200 hover:bg-green-100"
                        : "bg-red-50 border border-red-200 hover:bg-red-100"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                  title={`${index + 1}: ${
                    isAnswered
                      ? isCorrect
                        ? t("correct")
                        : t("wrong")
                      : t("unanswered")
                  }`}
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg flex items-center justify-center ${
                      isAnswered
                        ? isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span className="font-bold text-sm md:text-base">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs md:text-sm font-medium">
                      Q{index + 1}
                    </span>
                    <div
                      className={`flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs ${
                        isAnswered
                          ? isCorrect
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {isAnswered ? (
                        <>
                          {isCorrect ? (
                            <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          ) : (
                            <XCircle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          )}
                          <span className="hidden sm:inline">
                            {isCorrect ? t("correct") : t("wrong")}
                          </span>
                        </>
                      ) : (
                        <span className="hidden sm:inline">
                          {t("unanswered")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Answer indicator */}
                  {isAnswered && (
                    <div className="text-[10px] md:text-xs text-dark-300 font-medium">
                      {t("your")} {String.fromCharCode(65 + userAnswer)}
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
                <span className="text-sm text-dark-300">
                  {t("correctAnswer")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-dark-300">
                  {t("incorrectAnswer")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span className="text-sm text-dark-300">
                  {t("notAnswered")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={enterReviewMode}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            {t("reviewAllQuestions")}
          </button>

          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {t("playAgain")}
          </button>
        </div>
      </div>
    </div>
  );
}

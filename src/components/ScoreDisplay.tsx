"use client";

import { useEffect, useRef, useState } from "react";
import { useQuiz } from "@/contexts/QuizContext";
import { useTranslations } from "next-intl";
import {
  Trophy,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Loader2,
  Users,
} from "lucide-react";

const POLL_MS = 1000;

export default function ScoreDisplay() {
  const t = useTranslations("score");
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
    myPlayerName,
    updateRoom,
    getRoom,
    saveScore,
    loadScores,
    playerScores,
  } = useQuiz();

  const reportedRef = useRef(false);
  const savedRef = useRef(false);
  const [hadBothPlayers, setHadBothPlayers] = useState(false);
  useEffect(() => {
    if (roomData?.player1 && roomData?.player2) {
      queueMicrotask(() => setHadBothPlayers(true));
    }
  }, [roomData?.player1, roomData?.player2]);

  // Room: report our score (P1 or P2) once, with optional name
  useEffect(() => {
    if (!quizCompleted || reportedRef.current || !selectedCategory) return;
    const name = myPlayerName?.trim() || undefined;
    if (gameMode === "create_room") {
      updateRoom({ player1: { score, total: totalQuestions, name } }).finally(
        () => {
          reportedRef.current = true;
        },
      );
    } else if (gameMode === "join_room") {
      updateRoom({ player2: { score, total: totalQuestions, name } }).finally(
        () => {
          reportedRef.current = true;
        },
      );
    }
  }, [
    quizCompleted,
    gameMode,
    selectedCategory,
    score,
    totalQuestions,
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

  // 2-Player: save and load scores once
  useEffect(() => {
    if (
      !quizCompleted ||
      savedRef.current ||
      gameMode !== "2player" ||
      !selectedPlayer ||
      !selectedCategory
    )
      return;
    saveScore(selectedPlayer, score, totalQuestions, selectedCategory).finally(
      () => {
        loadScores().finally(() => {
          savedRef.current = true;
        });
      },
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
                {playerScores?.player1?.history?.length
                  ? `${playerScores.player1.history.slice(-1)[0].score}/${
                      playerScores.player1.history.slice(-1)[0].total
                    }`
                  : "—"}
              </span>
              <span>
                {t("player2Label")}{" "}
                {playerScores?.player2?.history?.length
                  ? `${playerScores.player2.history.slice(-1)[0].score}/${
                      playerScores.player2.history.slice(-1)[0].total
                    }`
                  : "—"}
              </span>
            </div>
          </div>
        )}

        {/* Multiplayer: Room comparison */}
        {(gameMode === "create_room" || gameMode === "join_room") && (
          <div className="p-4 md:p-5 bg-white/60 rounded-xl border border-primary/20">
            <h3 className="flex items-center gap-2 font-semibold text-dark-300 mb-3">
              <Users className="w-5 h-5 text-primary" />
              {t("roomResults")}
            </h3>
            {roomData?.player1 || roomData?.player2 ? (
              <div>
                {(gameMode === "create_room" && roomData?.player1 && !roomData?.player2 && hadBothPlayers) ||
                (gameMode === "join_room" && roomData?.player2 && !roomData?.player1 && hadBothPlayers) ? (
                  <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm font-medium mb-3">
                    {t("otherPlayerLeft")}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>
                    <strong>
                      {roomData?.player1?.name
                        ? `${roomData.player1.name}:`
                        : t("player1Label")}
                    </strong>{" "}
                    {roomData?.player1
                      ? `${roomData.player1.score}/${roomData.player1.total}`
                      : "—"}
                  </span>
                  <span>
                    <strong>
                      {roomData?.player2?.name
                        ? `${roomData.player2.name}:`
                        : t("player2Label")}
                    </strong>{" "}
                    {roomData?.player2
                      ? `${roomData.player2.score}/${roomData.player2.total}`
                      : "—"}
                  </span>
                </div>
                {(!roomData?.player1 || !roomData?.player2) && !hadBothPlayers && (
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

        {/* Question Review Grid */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-dark-300">
              {t("questionReview")}
            </h3>
            <p className="text-dark-200 text-sm">{t("clickToReview")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
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
                  className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
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
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isAnswered
                        ? isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span className="font-bold">{index + 1}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium">Q{index + 1}</span>
                    <div
                      className={`flex items-center gap-1 text-xs ${
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
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{isCorrect ? t("correct") : t("wrong")}</span>
                        </>
                      ) : (
                        <span>{t("unanswered")}</span>
                      )}
                    </div>
                  </div>

                  {/* Answer indicator */}
                  {isAnswered && (
                    <div className="text-xs text-dark-300 font-medium">
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

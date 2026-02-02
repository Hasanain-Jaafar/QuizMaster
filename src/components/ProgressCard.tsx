"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, Flame, Target, BookOpen } from "lucide-react";
import {
  loadLearningState,
  getDueCount,
  resetProgress,
} from "@/utils/learningStorage";
import { useQuiz } from "@/contexts/QuizContext";

export default function ProgressCard() {
  const t = useTranslations("progress");
  const { startPracticeDue } = useQuiz();
  const [stats, setStats] = useState({
    streak: 0,
    longest: 0,
    quizzes: 0,
    average: 0,
    dueCount: 0,
  });

  const refreshStats = () => {
    const state = loadLearningState();
    const average =
      state.stats.totalQuestionsAnswered > 0
        ? Math.round(
            (state.stats.totalCorrect / state.stats.totalQuestionsAnswered) *
              100
          )
        : 0;

    setStats({
      streak: state.stats.streak.current,
      longest: state.stats.streak.longest,
      quizzes: state.stats.quizzesCompleted,
      average,
      dueCount: getDueCount(),
    });
  };

  useEffect(() => {
    refreshStats();
    // Refresh every 30 seconds to catch due questions
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all progress? This cannot be undone."
      )
    ) {
      resetProgress();
      refreshStats();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          {t("resetProgress")}
        </button>
      </div>

      <div className="space-y-3">
        {/* Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{t("streak")}</span>
          </div>
          <span className="font-semibold text-gray-900">
            {stats.streak}{" "}
            {stats.longest > 0 && `(${t("longest")}: ${stats.longest})`}
          </span>
        </div>

        {/* Quizzes completed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4 text-blue-500" />
            <span>{t("quizzes")}</span>
          </div>
          <span className="font-semibold text-gray-900">{stats.quizzes}</span>
        </div>

        {/* Average accuracy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>{t("average")}</span>
          </div>
          <span className="font-semibold text-gray-900">{stats.average}%</span>
        </div>

        {/* Due count */}
        {stats.dueCount > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>{t("dueCount")}</span>
            </div>
            <span className="font-semibold text-purple-600">
              {stats.dueCount}
            </span>
          </div>
        )}
      </div>

      {/* Practice button */}
      {stats.dueCount > 0 && (
        <button
          type="button"
          onClick={startPracticeDue}
          className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          {t("practiceDue")}
        </button>
      )}
    </div>
  );
}

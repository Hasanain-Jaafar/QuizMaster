"use client";

import Quiz from "@/components/Quiz";
import Leaderboard from "@/components/Leaderboard";
import ProgressCard from "@/components/ProgressCard";
import { QuizProvider } from "@/contexts/QuizContext";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Brain,
  Target,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LANG_NAMES: Record<string, string> = { en: "En", ar: "Ar", sv: "Sv" };

export default function Home() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <QuizProvider>
      <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="shrink-0 bg-white shadow-sm border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-linear-to-r from-blue-600 to-gray-400 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-700">
                    {t("title")}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden md:flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{t("header100")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{t("headerMultiple")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>{t("headerFeedback")}</span>
                  </div>
                </div>
                {/* Language dropdown */}
                <div className="relative mt-2 md:mt-0" ref={langDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setLangOpen((o) => !o)}
                    aria-expanded={langOpen}
                    aria-haspopup="listbox"
                    aria-label={t("language")}
                    className="flex items-center gap-1 px-2 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>{LANG_NAMES[locale] ?? locale}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        langOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {langOpen && (
                    <div
                      role="listbox"
                      className="absolute top-full start-0 mt-1 min-w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-1 z-50"
                    >
                      {(["en", "ar", "sv"] as const).map((loc) => (
                        <Link
                          key={loc}
                          href="/"
                          locale={loc}
                          role="option"
                          aria-selected={locale === loc}
                          onClick={() => setLangOpen(false)}
                          className={`block px-3 py-2 text-sm transition-colors ${
                            locale === loc
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {LANG_NAMES[loc]}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("welcome")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <button
                  type="button"
                  onClick={() => setInstructionsOpen((o) => !o)}
                  className="w-full flex items-center justify-between text-start gap-2 group"
                  aria-expanded={instructionsOpen}
                  aria-controls="quiz-instructions-content"
                  id="quiz-instructions-toggle"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {t("instructionsTitle")}
                  </h3>
                  <span className="shrink-0 p-1 rounded-lg text-gray-500 group-hover:bg-gray-100 transition-colors">
                    {instructionsOpen ? (
                      <ChevronUp className="w-5 h-5" aria-hidden />
                    ) : (
                      <ChevronDown className="w-5 h-5" aria-hidden />
                    )}
                  </span>
                </button>

                <div
                  id="quiz-instructions-content"
                  role="region"
                  aria-labelledby="quiz-instructions-toggle"
                  className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                    instructionsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-4 mt-4">
                      <li className="flex items-start gap-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">
                            1
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {t("instruction1")}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">
                            2
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {t("instruction2")}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">
                            3
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {t("instruction3")}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">
                            4
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {t("instruction4")}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">
                            5
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {t("instruction5")}
                        </span>
                      </li>
                    </ul>

                    <div className="mt-8 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("quickTips")}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t("quickTipsText")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <ProgressCard />

              {/* Leaderboard */}
              <Leaderboard />
            </div>

            {/* Quiz Area */}
            <div className="lg:col-span-2 min-w-0">
              <Quiz />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 mt-auto border-t bg-white border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <p>{t("footer")}</p>
            </div>
          </div>
        </footer>
      </div>
    </QuizProvider>
  );
}

'use client';

import Quiz from '@/components/Quiz';
import { QuizProvider } from '@/contexts/QuizContext';
import { Brain, Target, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [instructionsOpen, setInstructionsOpen] = useState(true);

  return (
    <QuizProvider>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-linear-to-r from-blue-600 to-gray-400 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-700">Alaradi Quiz</h1>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>100 Questions</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Multiple Choice</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>Instant Feedback</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Alaradi Quiz Challenge
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Test your knowledge across various topics. Select one answer per question. 
              You&apos;ll get immediate feedback and explanations!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <button
                  type="button"
                  onClick={() => setInstructionsOpen((o) => !o)}
                  className="w-full flex items-center justify-between text-left gap-2 group"
                  aria-expanded={instructionsOpen}
                  aria-controls="quiz-instructions-content"
                  id="quiz-instructions-toggle"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Quiz Instructions
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
                    instructionsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-4 mt-4">
                      <li className="flex items-start space-x-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">1</span>
                        </div>
                        <span className="text-gray-600">Read each question carefully</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">2</span>
                        </div>
                        <span className="text-gray-600">Select one of the three options</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">3</span>
                        </div>
                        <span className="text-gray-600">Get immediate feedback on your answer</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">4</span>
                        </div>
                        <span className="text-gray-600">Navigate between questions freely</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">5</span>
                        </div>
                        <span className="text-gray-600">View your final score at the end</span>
                      </li>
                    </ul>

                    <div className="mt-8 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Quick Tips</h4>
                      <p className="text-sm text-gray-600">
                        Take your time with each question. You can always go back and review your answers before finishing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Area */}
            <div className="lg:col-span-2">
              <Quiz />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t bg-white border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <p>© 2026 Alaradi Quiz. All questions are for educational purposes.</p>
              <p className="mt-2">Built with Next.js 14, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </footer>
      </div>
    </QuizProvider>
  );
}
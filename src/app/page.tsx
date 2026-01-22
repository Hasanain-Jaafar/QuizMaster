'use client';

import Quiz from '@/components/Quiz';
import { QuizProvider } from '@/contexts/QuizContext';
import { Brain, Target, Clock, Award } from 'lucide-react';

export default function Home() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">QuizMaster</h1>
                  <p className="text-sm text-gray-500">Test your knowledge</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>10 Questions</span>
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
              Welcome to the Ultimate Quiz Challenge
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your knowledge across various topics. Select one answer per question. 
              You&apos;ll get immediate feedback and explanations!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Instructions</h3>
                <ul className="space-y-4">
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

            {/* Quiz Area */}
            <div className="lg:col-span-2">
              <Quiz />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <p>© 2024 QuizMaster. All questions are for educational purposes.</p>
              <p className="mt-2">Built with Next.js 14, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </footer>
      </div>
    </QuizProvider>
  );
}
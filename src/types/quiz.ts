export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; 
    explanation?: string;
  }
  
  export interface QuizState {
    currentQuestionIndex: number;
    score: number;
    userAnswers: number[]; 
    quizCompleted: boolean;
  }
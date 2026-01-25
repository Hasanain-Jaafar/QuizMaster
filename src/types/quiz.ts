export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; 
    explanation?: string;
    category:string;
    difficulty:string;
  }
  
  export interface QuizState {
    currentQuestionIndex: number;
    score: number;
    userAnswers: number[]; 
    quizCompleted: boolean;
  }
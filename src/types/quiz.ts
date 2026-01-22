export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // Index of correct option (0, 1, or 2)
    explanation?: string;
  }
  
  export interface QuizState {
    currentQuestionIndex: number;
    score: number;
    userAnswers: number[]; // Store selected option index for each question
    quizCompleted: boolean;
  }
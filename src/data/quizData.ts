import { QuizQuestion } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter"],
    correctAnswer: 1,
    explanation: "Mars is often referred to as the Red Planet due to its reddish appearance."
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe"],
    correctAnswer: 1,
    explanation: "The Blue Whale is the largest mammal, growing up to 100 feet long."
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso"],
    correctAnswer: 1,
    explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1506."
  },
  {
    id: 5,
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "O2"],
    correctAnswer: 0,
    explanation: "H2O is the chemical formula for water, consisting of two hydrogen atoms and one oxygen atom."
  },
  {
    id: 6,
    question: "Which programming language is known as the language of the web?",
    options: ["Python", "JavaScript", "Java"],
    correctAnswer: 1,
    explanation: "JavaScript is the primary language for web development and runs in all modern browsers."
  },
  {
    id: 7,
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino"],
    correctAnswer: 1,
    explanation: "Vatican City is the smallest country by both area and population."
  },
  {
    id: 8,
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium"],
    correctAnswer: 1,
    explanation: "Hydrogen is the first element on the periodic table with atomic number 1."
  },
  {
    id: 9,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen"],
    correctAnswer: 1,
    explanation: "William Shakespeare wrote the tragic play 'Romeo and Juliet'."
  },
  {
    id: 10,
    question: "What is the speed of light in vacuum?",
    options: ["299,792,458 m/s", "300,000,000 m/s", "299,792 km/s"],
    correctAnswer: 0,
    explanation: "The exact speed of light in vacuum is 299,792,458 meters per second."
  }
];
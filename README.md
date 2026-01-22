# QuizMaster 🧠

A modern, interactive quiz application built with Next.js, TypeScript, and Tailwind CSS. Test your knowledge across various topics with immediate feedback and detailed explanations.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38bdf8?style=flat-square&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=flat-square&logo=react)

## ✨ Features

- **Interactive Quiz Experience**: Navigate through questions with intuitive controls
- **Immediate Feedback**: Get instant feedback on your answers with visual indicators
- **Detailed Explanations**: Learn from explanations provided for each question
- **Progress Tracking**: Visual progress bar and question counter
- **Question Navigation**: 
  - Jump to any question using the question list
  - Navigate with Previous/Next buttons
  - Quick navigation dots for mobile users
- **Score Display**: Beautiful score display with performance feedback
- **Responsive Design**: Fully responsive design that works on all devices
- **Modern UI**: Clean, modern interface with smooth animations and transitions
- **Accessibility**: Built with accessibility in mind (ARIA labels, keyboard navigation)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quiz.git
cd quiz
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
quiz/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles and Tailwind config
│   ├── components/         # React components
│   │   ├── Quiz.tsx        # Main quiz component
│   │   ├── OptionButton.tsx # Answer option button
│   │   ├── QuestionNavigation.tsx # Navigation controls
│   │   ├── ProgressBar.tsx # Progress indicator
│   │   └── ScoreDisplay.tsx # Final score display
│   ├── contexts/           # React contexts
│   │   └── QuizContext.tsx # Quiz state management
│   ├── data/              # Data files
│   │   └── quizData.ts    # Quiz questions data
│   └── types/             # TypeScript type definitions
│       └── quiz.ts        # Quiz-related types
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🎯 How It Works

1. **Start the Quiz**: The quiz begins with the first question
2. **Answer Questions**: Select an answer from the three options provided
3. **Get Feedback**: Immediate visual feedback shows if your answer is correct
4. **Navigate**: Use the navigation controls to move between questions
5. **Complete**: Answer all questions to unlock the "Show Results" button
6. **View Results**: See your final score with detailed performance metrics

## 🎨 Customization

### Adding New Questions

Edit `src/data/quizData.ts` to add or modify questions:

```typescript
{
  id: 11,
  question: "Your question here?",
  options: ["Option A", "Option B", "Option C"],
  correctAnswer: 0, // Index of correct answer (0, 1, or 2)
  explanation: "Explanation of the answer"
}
```

### Styling

The app uses Tailwind CSS v4 with custom theme variables defined in `src/app/globals.css`. You can customize:

- Colors: Modify CSS variables in the `@theme` block
- Components: Edit component classes in the `@layer components` section
- Utilities: Add custom utilities in the `@layer utilities` section

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.4](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript 5.9.3](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4.1.18](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **State Management**: React Context API

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ using Next.js and TypeScript

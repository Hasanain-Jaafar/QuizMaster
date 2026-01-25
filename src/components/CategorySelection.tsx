'use client';

import { useQuiz } from '@/contexts/QuizContext';
import {
  Layers,
  FlaskConical,
  Globe,
  Landmark,
  Laptop,
  Film,
  Trophy,
  Utensils,
  Lightbulb,
  LucideIcon,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  all: Layers,
  Science: FlaskConical,
  Geography: Globe,
  History: Landmark,
  Technology: Laptop,
  Entertainment: Film,
  Sports: Trophy,
  'Food & Drink': Utensils,
  'General Knowledge': Lightbulb,
};

function getCategoryIcon(id: string): LucideIcon {
  return CATEGORY_ICONS[id] ?? Lightbulb;
}

export default function CategorySelection() {
  const { categories, startQuiz } = useQuiz();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">
          Choose a category
        </h2>
        <p className="text-dark-200 text-sm md:text-base">
          Select a topic to start your quiz. You can also play across all categories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isAll = cat.id === 'all';

          return (
            <button
              key={cat.id}
              onClick={() => startQuiz(cat.id)}
              className={`
                p-4 md:p-5 rounded-xl text-left transition-all
                flex items-center gap-4
                border-2
                ${isAll
                  ? 'bg-primary/5 border-primary/30 hover:border-primary hover:bg-primary/10'
                  : 'bg-white border-light-300 hover:border-primary/50 hover:bg-primary/5'
                }
                shadow-sm hover:shadow-md active:scale-[0.99]
              `}
            >
              <div
                className={`
                  shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  ${isAll ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}
                `}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-dark-300 truncate">{cat.name}</div>
                <div className="text-sm text-dark-200">{cat.count} questions</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

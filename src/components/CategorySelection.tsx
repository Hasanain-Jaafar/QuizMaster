'use client';

import { useQuiz } from '@/contexts/QuizContext';
import { useTranslations } from 'next-intl';
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
  Sprout,
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
  'self-development': Sprout,
  'self-development_entrepreneur': Sprout,
};

function getCategoryIcon(id: string): LucideIcon {
  return CATEGORY_ICONS[id] ?? Lightbulb;
}

/** Map category id from quizData to i18n key in categories.* */
function getCategoryKey(id: string): string {
  const map: Record<string, string> = {
    'all': 'all',
    'Science': 'science',
    'Geography': 'geography',
    'History': 'history',
    'Technology': 'technology',
    'Entertainment': 'entertainment',
    'Sports': 'sports',
    'Food & Drink': 'foodAndDrink',
    'General Knowledge': 'generalKnowledge',
    'self-development': 'selfDevelopment',
    'self-development_entrepreneur': 'selfDevelopmentEntrepreneur',
  };
  return map[id] ?? id;
}

export default function CategorySelection() {
  const t = useTranslations('category');
  const tCat = useTranslations('categories');
  const { categories, startQuiz, gameMode, roomCode, updateRoom, resetToModeSelection } = useQuiz();

  const handlePick = async (categoryId: string) => {
    if (gameMode === 'create_room' && roomCode) {
      const ok = await updateRoom({ category: categoryId, status: 'started' });
      if (ok) startQuiz(categoryId);
    } else {
      startQuiz(categoryId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-300 mb-2">
          {t('chooseCategory')}
        </h2>
        <p className="text-dark-200 text-sm md:text-base">
          {t('selectTopic')}
        </p>
      </div>

      {(gameMode === 'solo' || gameMode === '2player' || gameMode === 'create_room') && (
        <div className="mb-4">
          <button
            onClick={resetToModeSelection}
            className="text-sm text-dark-200 hover:text-primary underline"
          >
            {t('backToModeSelection')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isAll = cat.id === 'all';
          const label = tCat(getCategoryKey(cat.id));

          return (
            <button
              key={cat.id}
              onClick={() => handlePick(cat.id)}
              className={`
                p-4 md:p-5 rounded-xl text-start transition-all
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
                <div className="font-semibold text-dark-300 truncate">{label}</div>
                <div className="text-sm text-dark-200">{t('questionsCount', { count: cat.count })}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

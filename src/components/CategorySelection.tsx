'use client';

import { useState, useEffect } from 'react';
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
  Copy,
  Check,
  Users,
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
  const tCreate = useTranslations('createRoom');
  const { categories, startQuiz, gameMode, roomCode, roomData, myPlayerName, setMyPlayerName, getRoom, updateRoom, resetToModeSelection } = useQuiz();
  const playerCount = roomData?.players?.filter(Boolean).length ?? 0;

  const handlePick = async (categoryId: string) => {
    if (gameMode === 'create_room' && roomCode) {
      await updateRoom({ category: categoryId, status: 'started' });
      startQuiz(categoryId);
    } else {
      startQuiz(categoryId);
    }
  };

  const [copied, setCopied] = useState(false);

  // Poll room when host is on category screen so player count updates
  useEffect(() => {
    if (gameMode !== 'create_room' || !roomCode) return;
    getRoom();
    const id = setInterval(() => getRoom(), 2000);
    return () => clearInterval(id);
  }, [gameMode, roomCode, getRoom]);

  const copyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Room code banner for host (create_room) so they can share and enter name while choosing category */}
      {gameMode === 'create_room' && roomCode && (
        <div className="mb-6 p-4 md:p-5 bg-white rounded-xl border-2 border-primary/20 shadow-sm">
          <label htmlFor="create-room-name-cat" className="block text-sm font-medium text-dark-300 mb-2">
            {tCreate('yourName')}
          </label>
          <input
            id="create-room-name-cat"
            type="text"
            value={myPlayerName ?? ''}
            onChange={(e) => setMyPlayerName(e.target.value || null)}
            placeholder={tCreate('yourNamePlaceholder')}
            className="w-full px-4 py-3 rounded-xl border-2 border-light-300 bg-white focus:border-primary focus:outline-none text-dark-300 placeholder:text-dark-100 mb-4 min-h-[3rem]"
            maxLength={32}
            aria-label={tCreate('yourName')}
          />
          <p className="text-sm text-dark-200 mb-2">{tCreate('roomCode')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-xl md:text-2xl font-mono font-bold tracking-widest text-primary bg-primary/10 px-3 py-2 rounded-lg"
              aria-label={`${tCreate('roomCode')}: ${roomCode}`}
            >
              {roomCode}
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="p-2 rounded-lg border border-light-300 hover:bg-primary/5 hover:border-primary/30 flex items-center gap-2"
              aria-label={tCreate('copy')}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-dark-200" />}
              <span className="text-sm font-medium">{copied ? tCreate('copied') : tCreate('copy')}</span>
            </button>
            <span className="text-sm text-dark-300 flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" />
              {tCreate('playersCount', { count: playerCount })}
            </span>
          </div>
          <p className="text-xs text-dark-200 mt-2">{tCreate('shareCode')}</p>
        </div>
      )}

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

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trophy, Loader2 } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/quiz';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function Leaderboard() {
  const t = useTranslations('leaderboard');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-leaderboard');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 2:
        return 'text-gray-500 bg-gray-50 border-gray-200';
      case 3:
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">{t('loading')}</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">{t('emptyState')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const percentage = Math.round(entry.percentage);
            
            return (
              <div
                key={`${entry.timestamp}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${getRankColor(
                    rank
                  )}`}
                >
                  {rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {entry.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {entry.category}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold text-gray-900">
                    {entry.score}/{entry.total}
                  </div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

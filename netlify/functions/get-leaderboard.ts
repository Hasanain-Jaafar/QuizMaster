import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type LeaderboardEntry = {
  name: string;
  score: number;
  total: number;
  category: string;
  timestamp: number;
  percentage: number;
};

export async function handler(event: any) {
  connectLambda(event);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const store = getStore('quiz-data');
  const raw = await store.get('leaderboard:global', { type: 'json' });
  const data = raw as { entries?: LeaderboardEntry[] } | null;
  const allEntries = (data && Array.isArray(data.entries)) ? data.entries : [];

  // Filter entries from last 24 hours
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  const recentEntries = allEntries.filter((entry) => entry.timestamp >= oneDayAgo);

  // Sort by percentage descending, then by timestamp (newer first)
  const sorted = recentEntries.sort((a, b) => {
    const diffPercentage = b.percentage - a.percentage;
    if (diffPercentage !== 0) return diffPercentage;
    return b.timestamp - a.timestamp;
  });

  // Return top 5
  const top5 = sorted.slice(0, 5);

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries: top5 }),
  };
}

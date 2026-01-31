import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PLAYER_IDS = ['player0', 'player1', 'player2', 'player3', 'player4', 'player5'] as const;
type Body = { playerId: string; score: number; total: number; category: string; name?: string };

type LeaderboardEntry = {
  name: string;
  score: number;
  total: number;
  category: string;
  timestamp: number;
  percentage: number;
};

function sanitizeName(name: string): string {
  // Extract first name only (split at space)
  const firstName = name.trim().split(' ')[0];
  // Remove special characters, keep only letters and basic chars
  const cleaned = firstName.replace(/[^a-zA-Z0-9\u0600-\u06FF\u0100-\u017F\s-]/g, '');
  // Limit to 20 characters
  return cleaned.substring(0, 20);
}

export async function handler(event: any) {
  connectLambda(event);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: Body;
  try {
    body = JSON.parse(event.body || '{}') as Body;
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { playerId, score, total, category, name } = body;
  if (!playerId || typeof score !== 'number' || typeof total !== 'number' || !category) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing playerId, score, total, or category' }) };
  }
  if (!PLAYER_IDS.includes(playerId as (typeof PLAYER_IDS)[number])) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'playerId must be player0 through player5' }) };
  }

  const store = getStore('quiz-data');
  
  // Save to player history (existing functionality)
  const key = `scores:${playerId}`;
  const existing = (await store.get(key, { type: 'json' })) as { history?: { score: number; total: number; category: string; date: string }[] } | null;
  const history = (existing && Array.isArray(existing.history)) ? existing.history : [];
  history.push({ score, total, category, date: new Date().toISOString() });
  await store.setJSON(key, { history });

  // Save to global leaderboard if name is provided
  if (name && name.trim()) {
    const sanitizedName = sanitizeName(name);
    if (sanitizedName) {
      const leaderboardKey = 'leaderboard:global';
      const leaderboardRaw = await store.get(leaderboardKey, { type: 'json' });
      const leaderboardData = leaderboardRaw as { entries?: LeaderboardEntry[] } | null;
      let entries = (leaderboardData && Array.isArray(leaderboardData.entries)) ? leaderboardData.entries : [];
      
      // Calculate new score data
      const timestamp = Date.now();
      const percentage = total > 0 ? (score / total) * 100 : 0;
      const newEntry: LeaderboardEntry = {
        name: sanitizedName,
        score,
        total,
        category,
        timestamp,
        percentage,
      };

      // Check if player already exists in leaderboard
      const existingIndex = entries.findIndex((entry) => entry.name.toLowerCase() === sanitizedName.toLowerCase());
      
      if (existingIndex !== -1) {
        // Player exists - keep only the better score
        const existingEntry = entries[existingIndex];
        if (percentage > existingEntry.percentage) {
          // New score is better, replace the old one
          entries[existingIndex] = newEntry;
        } else if (percentage === existingEntry.percentage && score > existingEntry.score) {
          // Same percentage but higher raw score (e.g., 9/10 vs 8/9)
          entries[existingIndex] = newEntry;
        }
        // Otherwise keep the existing better score
      } else {
        // Player doesn't exist, add new entry
        entries.push(newEntry);
      }

      // Clean up entries older than 7 days
      const sevenDaysAgo = timestamp - (7 * 24 * 60 * 60 * 1000);
      const filteredEntries = entries.filter((entry) => entry.timestamp >= sevenDaysAgo);

      await store.setJSON(leaderboardKey, { entries: filteredEntries });
    }
  }

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
}

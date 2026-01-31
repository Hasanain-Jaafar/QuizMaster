import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type ScoreEntry = { score: number; total: number; category: string; date: string };
type PlayerData = { history: ScoreEntry[] };

export async function handler(event: any) {
  connectLambda(event);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const playerId = event.queryStringParameters?.playerId ?? undefined;
  const PLAYER_IDS = ['player0', 'player1', 'player2', 'player3', 'player4', 'player5'] as const;

  const store = getStore('quiz-data');
  const result: Record<string, PlayerData> = {};

  const fetchOne = async (id: string) => {
    const raw = await store.get(`scores:${id}`, { type: 'json' });
    const data = raw as { history?: ScoreEntry[] } | null;
    return data && Array.isArray(data.history) ? { history: data.history } : { history: [] };
  };

  if (playerId && PLAYER_IDS.includes(playerId as (typeof PLAYER_IDS)[number])) {
    result[playerId] = await fetchOne(playerId);
  } else {
    for (const id of PLAYER_IDS) {
      result[id] = await fetchOne(id);
    }
  }

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
}

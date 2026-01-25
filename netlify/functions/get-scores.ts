import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type ScoreEntry = { score: number; total: number; category: string; date: string };
type PlayerData = { history: ScoreEntry[] };

export async function handler(event: { httpMethod: string; queryStringParameters?: Record<string, string | undefined> | null }) {
  connectLambda(event);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const playerId = event.queryStringParameters?.playerId ?? undefined;

  const store = getStore('quiz-data');
  const result: { player1?: PlayerData; player2?: PlayerData } = {};

  const fetchOne = async (id: 'player1' | 'player2') => {
    const raw = await store.get(`scores:${id}`, { type: 'json' });
    const data = raw as { history?: ScoreEntry[] } | null;
    return data && Array.isArray(data.history) ? { history: data.history } : { history: [] };
  };

  if (playerId === 'player1' || playerId === 'player2') {
    result[playerId] = await fetchOne(playerId);
  } else {
    result.player1 = await fetchOne('player1');
    result.player2 = await fetchOne('player2');
  }

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
}

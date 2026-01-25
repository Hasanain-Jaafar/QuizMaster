import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type Body = { playerId: 'player1' | 'player2'; score: number; total: number; category: string };

export async function handler(event: { httpMethod: string; body?: string }) {
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

  const { playerId, score, total, category } = body;
  if (!playerId || typeof score !== 'number' || typeof total !== 'number' || !category) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing playerId, score, total, or category' }) };
  }
  if (playerId !== 'player1' && playerId !== 'player2') {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'playerId must be player1 or player2' }) };
  }

  const store = getStore('quiz-data');
  const key = `scores:${playerId}`;
  const existing = (await store.get(key, { type: 'json' })) as { history?: { score: number; total: number; category: string; date: string }[] } | null;
  const history = Array.isArray(existing?.history) ? existing.history : [];
  history.push({ score, total, category, date: new Date().toISOString() });
  await store.setJSON(key, { history });

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
}

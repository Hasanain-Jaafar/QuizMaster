import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function randomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

export async function handler(event: any) {
  connectLambda(event);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const store = getStore('quiz-data');
  let code: string;
  for (let attempt = 0; attempt < 10; attempt++) {
    code = randomCode();
    const existing = await store.get(`room:${code}`);
    if (!existing) break;
  }
  code = code!;

  const ROOM_MAX_PLAYERS = 6;
  const room = {
    code,
    players: Array(ROOM_MAX_PLAYERS).fill(null) as ({ score: number; total: number; name?: string } | null)[],
    category: null as string | null,
    status: 'waiting' as const,
    createdAt: Date.now(),
  };
  await store.setJSON(`room:${code}`, room);

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) };
}

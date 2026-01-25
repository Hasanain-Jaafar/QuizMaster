import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type Room = {
  code: string;
  player1: { score: number; total: number } | null;
  player2: { score: number; total: number } | null;
  category: string | null;
  status: 'waiting' | 'started' | 'completed';
  createdAt: number;
};

export async function handler(req: { httpMethod: string; queryStringParameters?: Record<string, string | undefined> | null }) {
  if (req.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (req.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const code = (req.queryStringParameters?.code || '').toUpperCase().trim();
  if (!code) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing code' }) };
  }

  const store = getStore('quiz-data');
  const room = (await store.get(`room:${code}`, { type: 'json' })) as Room | null;
  if (!room) {
    return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Room not found' }) };
  }

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(room) };
}

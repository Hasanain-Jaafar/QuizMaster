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

type Body = {
  code: string;
  category?: string;
  status?: 'waiting' | 'started' | 'completed';
  player1?: { score: number; total: number } | null;
  player2?: { score: number; total: number } | null;
};

export async function handler(req: { httpMethod: string; body?: string }) {
  if (req.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (req.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: Body;
  try {
    body = JSON.parse(req.body || '{}') as Body;
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { code: raw, category, status, player1, player2 } = body;
  const code = (raw || '').toUpperCase().trim();
  if (!code) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing code' }) };
  }

  const store = getStore('quiz-data');
  const existing = (await store.get(`room:${code}`, { type: 'json' })) as Room | null;
  if (!existing) {
    return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Room not found' }) };
  }

  const updates: Partial<Room> = {};
  if (category !== undefined) updates.category = category;
  if (status !== undefined) updates.status = status;
  if (player1 !== undefined) updates.player1 = player1;
  if (player2 !== undefined) updates.player2 = player2;

  let next: Room = { ...existing, ...updates };
  // When player2 is set, mark as completed
  if (player2 !== undefined && player2 != null) {
    next = { ...next, status: 'completed' };
  }
  await store.setJSON(`room:${code}`, next);

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(next) };
}

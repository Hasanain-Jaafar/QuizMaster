import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type RoomPlayer = { score: number; total: number; name?: string } | null;
type Room = {
  code: string;
  players: RoomPlayer[];
  category: string | null;
  status: 'waiting' | 'started' | 'completed';
  createdAt: number;
};

const ROOM_MAX_PLAYERS = 6;

function normalizeRoom(raw: unknown): Room {
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.players) && r.players.length >= ROOM_MAX_PLAYERS) {
    return raw as Room;
  }
  const legacy = raw as { player1?: RoomPlayer; player2?: RoomPlayer };
  const players: RoomPlayer[] = Array(ROOM_MAX_PLAYERS).fill(null);
  if (legacy.player1 != null) players[0] = legacy.player1;
  if (legacy.player2 != null) players[1] = legacy.player2;
  return {
    code: (r.code as string) ?? '',
    players,
    category: (r.category as string | null) ?? null,
    status: (r.status as Room['status']) ?? 'waiting',
    createdAt: (r.createdAt as number) ?? Date.now(),
  };
}

export async function handler(event: any) {
  connectLambda(event);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const code = (event.queryStringParameters?.code || '').toUpperCase().trim();
  if (!code) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing code' }) };
  }

  const store = getStore('quiz-data');
  const raw = await store.get(`room:${code}`, { type: 'json' });
  if (!raw) {
    return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Room not found' }) };
  }

  const room = normalizeRoom(raw);
  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(room) };
}

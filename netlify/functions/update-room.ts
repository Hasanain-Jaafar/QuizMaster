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

type Body = {
  code: string;
  category?: string;
  status?: 'waiting' | 'started' | 'completed';
  players?: RoomPlayer[];
  playerIndex?: number;
  player?: RoomPlayer;
};

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

  const { code: raw, category, status, players: playersFull, playerIndex, player } = body;
  const code = (raw || '').toUpperCase().trim();
  if (!code) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing code' }) };
  }

  const store = getStore('quiz-data');
  const raw = await store.get(`room:${code}`, { type: 'json' });
  if (!raw) {
    return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Room not found' }) };
  }
  const r = raw as Record<string, unknown>;
  const legacy = raw as { player1?: RoomPlayer; player2?: RoomPlayer };
  let existing: Room = raw as Room;
  if (!Array.isArray(r.players) || r.players.length < ROOM_MAX_PLAYERS) {
    existing = {
      code: (r.code as string) ?? '',
      players: Array(ROOM_MAX_PLAYERS).fill(null),
      category: (r.category as string | null) ?? null,
      status: (r.status as Room['status']) ?? 'waiting',
      createdAt: (r.createdAt as number) ?? Date.now(),
    };
    if (legacy.player1 != null) existing.players[0] = legacy.player1;
    if (legacy.player2 != null) existing.players[1] = legacy.player2;
  }

  let nextPlayers: RoomPlayer[] = [...existing.players];
  if (nextPlayers.length < ROOM_MAX_PLAYERS) {
    while (nextPlayers.length < ROOM_MAX_PLAYERS) nextPlayers.push(null);
  }

  if (playersFull !== undefined && Array.isArray(playersFull)) {
    nextPlayers = playersFull.slice(0, ROOM_MAX_PLAYERS);
    while (nextPlayers.length < ROOM_MAX_PLAYERS) nextPlayers.push(null);
  } else if (typeof playerIndex === 'number' && playerIndex >= 0 && playerIndex < ROOM_MAX_PLAYERS) {
    nextPlayers[playerIndex] = player ?? null;
  }

  const next: Room = {
    ...existing,
    category: category !== undefined ? category : existing.category,
    status: status !== undefined ? status : existing.status,
    players: nextPlayers,
  };

  const hasSubmitted = (p: RoomPlayer): boolean =>
    p != null && typeof p.score === 'number' && typeof p.total === 'number' && p.score >= 0 && p.total > 0;
  const filledSlots = nextPlayers.filter((p) => p != null);
  const allSubmitted = filledSlots.length > 0 && filledSlots.every(hasSubmitted);
  if (allSubmitted) {
    next.status = 'completed';
  }

  await store.setJSON(`room:${code}`, next);

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(next) };
}

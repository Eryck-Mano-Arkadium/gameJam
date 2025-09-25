/**
 * Placeholder for a realtime provider (Supabase/Ably/Pusher/Socket.IO).
 * Use this interface with the same LeaderboardService API to push:
 * - roundId/phase ticks (authoritative)
 * - ephemeral leaderboard submissions
 *
 * Example (Supabase Realtime pseudo):
 *
 * import { createClient } from '@supabase/supabase-js';
 * const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
 * const channel = sb.channel('streak_trivia');
 * channel.on('broadcast', { event: 'lb' }, payload => { ...update... }).subscribe();
 * channel.send({ type: 'broadcast', event: 'lb', payload: {...rec} });
 */
export {};

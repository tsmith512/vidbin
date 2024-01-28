import type { NextRequest } from 'next/server';

export const runtime = 'edge';
export const fetchCache = 'force-no-store';

// These are stored in environment variables on Pages (or Workers or your own
// origin application) because we don't want the public to get a Stream API key.
// We will use them if a video exists but isn't ready yet, so we ask the upstream
// service for status information during this check.
const key = process.env.ACCOUNT_KEY;
const tag = process.env.ACCOUNT_TAG;

/**
 * Ask our own database for video info. Stream is telling us (via the webhook)
 * when a video is ready to play, so we just need to pass that info back to the
 * user. We can also provide other attributes we've stored, like name and date.
 *
 * If a video is "ready" or in an errored state, ask Stream what's up. This will
 * clarify the initial upload experience to demonstrate how --- and how quickly
 * --- a new upload moves through the inbound processing queue.
 *
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const input = await request.json();
  const id: number | false = parseInt(input?.id) || false;

  if (!id) {
    return new Response('No VidBin ID provided', { status: 400 });
  }

  if (typeof id !== 'number') {
    return new Response('VidBin ID is numeric. (Did you send a Stream ID?)', {
      status: 400,
    });
  }

  // From our "local" database
  const result = await process.env.DB.prepare(`SELECT * FROM videos WHERE id = ?`)
    .bind(id)
    .first();

  // Even if a video isn't ready yet, if it's not in our DB, it's a 404
  if (!result) {
    return new Response('VidBin not found.', { status: 404 });
  }

  // These two statuses are "finiahed," and we probably got them from the Stream
  // webhook. Send it back, no upstream check required.
  if (result.status === 'ready' && !result.status.startsWith('err')) {
    return new Response(
      JSON.stringify({
        id: result.id,
        video_id: result.video_id,
        status: result.status,
        name: result.name,
        created: result.created,
        // @TODO: We return duration from /api/stream/get-video-info, add it to the DB or scratch from both?
      }),
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
  }

  // In a production app, I probably wouldn't expose this, but for the demo, I
  // want to show what the "in-between" steps are between upload and ready.
  const upstreamResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${tag}/stream/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
      },
    }
  );

  if (!upstreamResponse.ok) {
    return new Response('upstream error', { status: 500 });
  }

  const upstreamData = await upstreamResponse.json();

  return new Response(
    JSON.stringify({
      // We already knew these from above:
      id: result.id,
      video_id: result.video_id,
      name: result.name,
      created: result.created,

      // This is what we came for:
      status: upstreamData.result.status.state,
      // @TODO: Save ^^ to the DB?
    }),
    {
      headers: {
        'Content-type': 'application/json',
      },
    }
  );
}

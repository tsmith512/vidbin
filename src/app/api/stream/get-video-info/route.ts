import type { NextRequest } from 'next/server';

export const runtime = 'edge';
export const fetchCache = 'force-no-store';

// These are stored in environment variables on Pages (or Workers or your own
// origin application) because we don't want the public to get a Stream API key.
const key = process.env.ACCOUNT_KEY;
const tag = process.env.ACCOUNT_TAG;

/**
 * Ask Stream about information for a video. We'll need this to know if a video
 * is ready to play, and some basics about it we may want to show on the frontend.
 *
 * @TODO: It'd be good to capture this in a database or other store so the
 * client doesn't have to pound the Stream API constantly.
 *
 * API: https://developers.cloudflare.com/api/operations/stream-videos-retrieve-video-details
 *
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const input = await request.json();
  const video_id = input.video_id || false;

  if (!video_id) {
    return new Response('No Video ID provided', { status: 400 });
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
    },
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${tag}/stream/${video_id}`,
    options
  );

  const data = await response.json();

  if (!response.ok) {
    return new Response('error', { status: 500 });
  }

  return new Response(
    JSON.stringify({
      // Stream Video ID
      video_id: data.result.uid,
      status: data.result.status.state,
      name: data.result.meta.name,
      duration: data.result.duration,
      created: data.result.created,
    }),
    {
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

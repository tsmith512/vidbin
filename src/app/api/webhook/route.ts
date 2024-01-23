import type { NextRequest } from 'next/server';

export const runtime = 'edge';

// These are stored in environment variables on Pages (or Workers or your own
// origin application) because we don't want the public to get a Stream API key.
const key = process.env.STREAM_API_WEBHOOK_KEY;

/**
 * This is an endpoint to receive a webhook from the Stream API with information
 * about the status of an uploaded video.
 *
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const data = await request.json();

  // @TODO: Validate the inbound webhook before processing it...
  // ref https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/#verify-webhook-authenticity

  let stateMessage: string;

  // We're doing some simplification here for demo purposes. If a video is errored
  // we'll get a code and reason why. But to simplify this prototype, mash that
  // into the status column so that VidBin will just have
  // [pending, queued, encoding, ready, ...ERROR_CODES].
  if (data.status?.state === 'error') {
    stateMessage = data.status?.errReasonCode ?? 'error';
  } else {
    stateMessage = data.status?.state ?? 'unknown';
  }

  const result = await process.env.DB.prepare(`
    UPDATE videos SET status = ? WHERE video_id = ?
  `).bind(stateMessage, data.uid).run();

  console.log(result);

  if (result?.meta?.changes === 0) {
    // The query succeeded, but didn't match anything in the DB.
    // Ultimately, this means a webhook was generated for a video in my account
    // unrelated to VidBin.
    return new Response('Video not recorded in VidBin', {status: 404});
  } else if (result?.meta?.changes === 1) {
    // Happy path
    return new Response(null, {status: 204});
  }

  // We changed more than one row?
  return new Response(JSON.stringify(result), {
    status: 500,
  });
}

import type { NextRequest } from 'next/server';

export const runtime = 'edge';

// These are stored in environment variables on Pages (or Workers or your own
// origin application) because we don't want the public to get a Stream API key.
const key = process.env.ACCOUNT_KEY;
const tag = process.env.ACCOUNT_TAG;

/**
 * Ask Stream to provison a direct creator upload URL for a basic file upload.
 *
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const input = await request.json();
  const name = input.name || '';

  // It's a temporary paste-bin, so let's make videos temporary:
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() + 31);

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      creator: 'vidbin beta',
      maxDurationSeconds: 60 * 30,
      scheduledDeletion: deletionDate,
      name: 'name in body',
      filename: 'filename in body',
      meta: {
        name: 'name in meta',
        filename: 'filename in meta',
      },
    }),
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${tag}/stream/direct_upload`,
    options
  );

  const data = await response.json();

  if (!response.ok) {
    return new Response('error', { status: 500 });
  }

  const { uid, uploadURL, scheduledDeletion } = data.result;

  const date = new Date();

  const { success } = await process.env.DB.prepare(`
    INSERT INTO videos (video_id, endpoint, created, status, scheduledDeletion)
    VALUES             (?,        ?,        ?,       ?,      ?);
  `).bind(uid, uploadURL, date.toISOString(), 'reserved', scheduledDeletion)
  .run();

  return new Response(
    JSON.stringify({
      // This will be the Stream Video ID
      video_id: uid,
      // And this is our temporary URL that we should upload it to
      endpoint: uploadURL,
    }),
    {
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

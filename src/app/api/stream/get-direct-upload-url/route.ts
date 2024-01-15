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
export async function GET(request: NextRequest) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      creator: 'vidbin beta',
      maxDurationSeconds: 60 * 30,
    }),
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${tag}/stream/direct_upload`,
    options
  );

  const endpoint = response.headers.get('location');

  return new Response(endpoint, {
    headers: {
      'Access-Control-Expose-Headers': 'Location',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

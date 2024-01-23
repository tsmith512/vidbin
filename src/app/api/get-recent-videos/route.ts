import type { NextRequest } from 'next/server';

export const runtime = 'edge';
export const fetchCache = 'force-no-store';

/**
 * Ask our own database for video info. Stream is telling us (via the webhook)
 * when a video is ready to play, so we just need to pass that info back to the
 * user. We can also provide other attributes we've stored, like name and date.
 *
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const { results } = await process.env.DB.prepare(`SELECT * FROM videos ORDER BY id DESC LIMIT 20`).run();

  if (!results.length) {
    return new Response('No videos found.', { status: 404 });
  }

  return new Response(
    JSON.stringify(results),
    {
      headers: {
        'Content-type': 'application/json',
      },
    }
  );
}

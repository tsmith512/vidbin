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
export async function POST(request: NextRequest) {
  const input = await request.json();
  const id: number | false = parseInt(input?.id) || false;

  if (!id) {
    return new Response('No VidBin ID provided', { status: 400 });
  }

  if (typeof id !== 'number') {
    return new Response('VidBin ID is numeric. (Did you send a Stream ID?)', { status: 400 });
  }

  const result = await process.env.DB.prepare(`SELECT * FROM videos WHERE id = ?`).bind(id).first();

  if (!result) {
    return new Response('VidBin not found.', { status: 404 });
  }

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

import type { NextRequest } from 'next/server';

export const runtime = 'edge';

// These are stored in environment variables on Pages (or Workers or your own
// origin application) because we don't want the public to get a Stream API key.
const key = process.env.ACCOUNT_KEY;
const tag = process.env.ACCOUNT_TAG;
const creator = process.env?.CREATOR_ID;

/**
 * Ask Stream to provison a direct creator upload URL for a basic file upload.
 *
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const input = await request.json();
  const name = input.name ?? 'untitled';

  // It's a temporary paste-bin, so let's make videos temporary:
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() + 31);

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      creator: creator ?? 'vidbin',
      maxDurationSeconds: 60 * 30,
      scheduledDeletion: deletionDate,
      meta: {
        // This will be overridden by the filename provided when uploaded, but
        // this is what will show in API/Dash until that happens.
        name: name,
      },
    }),
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${tag}/stream/direct_upload`,
    options
  );

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    return new Response('error', { status: 500 });
  }

  // Now prepare the data we'll save and send to the user and save in our own DB
  const { uid, uploadURL, scheduledDeletion } = data.result;

  //  We want to note when this was created:
  const date = new Date();

  // We will pass the scheduled deletion date the API gave us rather than the
  // one we calculated in the original request.
  // (@TODO: Can I articulate a good reason for that? Or am I being weird...)

  const { success } = await process.env.DB.prepare(
    `
    INSERT INTO videos (video_id, endpoint,  name, created,            status,     scheduledDeletion)
    VALUES             (?,        ?,         ?,    ?,                  ?,          ?);
  `
  )
    .bind(uid, uploadURL, name, date.toISOString(), 'uploading', scheduledDeletion)
    .run();

  if (!success) {
    console.log('Failed to create VidBin record.');
    return new Response('Failed to create VidBin record.', { status: 500 });
  }

  // Now we need to get the VidBin ID (numeric table ID) that we just created.
  // @TODO: Question for D1 folks -- is there a 'last inserted id' feature?
  const id = await process.env.DB.prepare(`SELECT id FROM videos WHERE video_id = ?`)
    .bind(uid)
    .first('id');

  return new Response(
    JSON.stringify({
      // This is our VidBin ID
      id,
      // This will be the Stream Video ID
      video_id: uid,
      // And this is our temporary URL that we should upload it to
      endpoint: uploadURL,
    }),
    {
      headers: {
        'Content-type': 'application/json',
      },
    }
  );
}

'use client';

export const dynamic = 'force-static';

import { Stream } from "@cloudflare/stream-react";

export default function ViewSingle({ params }: { params: { id: string }}) {
  return (
    <>
      <div>
        <h2>View a Video</h2>
        <h3>With a Code</h3>
        <input type="text" disabled value={params.id} />
        <Stream controls src={params.id} />
      </div>
    </>
  );
}

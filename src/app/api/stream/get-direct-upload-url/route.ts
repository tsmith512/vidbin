import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return new Response(
    'Placeholder: Return a direct creator upload endpoint',
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
}

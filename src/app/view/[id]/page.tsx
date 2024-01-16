'use client';

export const dynamic = 'force-static';
export const runtime = 'edge';

import { useState, useEffect, useRef } from 'react';

import { Stream } from '@cloudflare/stream-react';

interface videoInfoProps {
  video_id: string;
  status: string;
  name: string;
  duration: string;
  created: string;
}

export default function ViewSingle({ params }: { params: { id: string } }) {
  const [videoInfo, setVideoInfo] = useState(null as null | videoInfoProps);
  const pollingRef = useRef<ReturnType<typeof setInterval>>();
  const [areWePolling, setAreWePolling] = useState(true);

  useEffect(() => {
    console.log('use effect running');
    const pollVideoInfo = async () => {
      console.log('polling!');
      const response = await fetch(`/api/stream/get-video-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: params.id }),
      });

      const data = await response.json();

      setVideoInfo(data);

      console.log(data);
      if (data.status === 'ready') {
        console.log('ending the poll');
        setAreWePolling(false);
      }
    };

    const startPolling = () => {
      pollVideoInfo();
      pollingRef.current = setInterval(pollVideoInfo, 5000);
    };

    const stopPolling = () => {
      clearInterval(pollingRef.current);
    };

    if (areWePolling) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [areWePolling]);

  return (
    <>
      <div>
        <h2>View a Video</h2>
        <h3>With a Code</h3>
        <input type="text" disabled value={params.id} />
        {videoInfo?.status !== 'ready' &&
          `Waiting for video to be ready. Currently ${videoInfo?.status || 'waiting'}.`}
        {videoInfo?.status === 'ready' && <Stream controls src={params.id} />}
      </div>
    </>
  );
}

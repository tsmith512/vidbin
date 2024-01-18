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

  const waiting = () => (
    <div className="empty">
      <div className="loading loading-lg"></div>
      <p className="empty-title h5">
        {videoInfo?.status &&
          `Waiting for video to be ready. Currently ${videoInfo.status}.`}
        {videoInfo?.status === null && `Loading...`}
      </p>
    </div>
  );

  return (
    <>
      <h2>View a Video</h2>
      {videoInfo?.status !== 'ready' && waiting()}
      {videoInfo?.status === 'ready' && (
        <div className="player-container">
          <Stream controls responsive={false} src={params.id} />
        </div>
      )}
    </>
  );
}

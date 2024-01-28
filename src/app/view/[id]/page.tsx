'use client';

export const dynamic = 'force-static';
export const runtime = 'edge';

import { useState, useEffect, useRef } from 'react';

import { Stream } from '@cloudflare/stream-react';

interface videoInfoProps {
  id: number; // This is the VidBin ID (numeric)
  video_id: string; // This is the Stream ID (long UUID string)
  status: string;
  name: string;
  duration: string;
  created: string;
}

// id here is a VidBin numeric ID, not a Stream ID. We don't want this app
// providing a view page for every video that exists, eh?
export default function ViewSingle({ params }: { params: { id: string } }) {
  const [videoInfo, setVideoInfo] = useState(null as null | videoInfoProps);
  const pollingRef = useRef<ReturnType<typeof setInterval>>();
  const [areWePolling, setAreWePolling] = useState(true);

  useEffect(() => {
    const pollVideoInfo = async () => {
      console.log('Polling for video information');
      const response = await fetch(`/api/get-video-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id }),
      });

      const data = await response.json();

      setVideoInfo(data);

      console.log(data);
      if (data.status === 'ready' || data.status.startsWith('err')) {
        console.log(`Video is ${data.status}. Ending poll.`);
        setAreWePolling(false);
      }
    };

    const startPolling = () => {
      pollVideoInfo();
      pollingRef.current = setInterval(pollVideoInfo, 2000);
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
  }, [areWePolling, params.id]);
  // ^^ params.id won't change, but eslint was mad about the missing dependency

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

  const errored = () => (
    <div className="empty">
      <div className="loading loading-lg"></div>
      <p className="empty-title h5">
        This video is unavailable due to an error ({videoInfo?.status ?? 'unknown'}).
      </p>
    </div>
  );

  return (
    <>
      <h2>{videoInfo?.name ?? 'View a Video'}</h2>
      {videoInfo?.status.match(/^ERR/i) && errored()}
      {videoInfo?.status !== 'ready' && waiting()}
      {videoInfo?.status === 'ready' && (
        <div className="player-container">
          <Stream controls responsive={false} src={videoInfo.video_id} />
        </div>
      )}
    </>
  );
}

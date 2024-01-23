'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function View() {
  const router = useRouter();
  const idField = useRef<HTMLInputElement>(null);

  const [videos, setVideos] = useState([]); // @TODO: Type for this?

  const gotoVideo = (e: React.FormEvent) => {
    e.preventDefault();

    if (idField.current) {
      router.push(`/view/${idField.current.value}`);
    }
  };

  const getRecentVideos = async () => {
    const result = await fetch('/api/get-recent-videos');
    result.json().then(v => setVideos(v));
  };

  useEffect(() => {
    console.log('callback');
    getRecentVideos();
  }, []);

  const timeSince = (input: string): string => {
    const then = new Date(input);
    const now = new Date();

    const hours = Math.ceil((now - then) / 1000 / 60 / 60);

    if (hours < 48) {
      return `${hours}hr`;
    } else {
      return `${Math.ceil(hours / 24)}d`;
    }
  }

  return (
    <>
      <h2>View a Video</h2>
      <form onSubmit={gotoVideo}>
        <div className="input-group view-by-code-form">
          <input
            className="form-input"
            type="text"
            ref={idField}
            placeholder="Enter VidBin ID"
          />
          <button
            className="btn btn-primary input-group-btn"
            type="submit"
            name="submit"
          >
            Watch
          </button>
        </div>
      </form>

      <div className="divider text-center" data-content="OR" style={{margin: '2rem 0'}}></div>

      <h3>Recent Uploads</h3>
      { videos.length > 0 || (<div className="empty"><p className="empty-title h5">No recent uploads</p></div>)}


      <div className="columns recent-videos">
        { /* @TODO: Type checking */ }
        { videos.map((v: any) => (
          <div className="column col-4 col-md-6 col-xs-12" key={v.id}>
            <a onClick={() => { router.push(`/view/${v.id}`); }} className="card">
              <div className="card-image">
                <img src={`https://cloudflarestream.com/${v.video_id}/thumbnails/thumbnail.gif`} />
              </div>
              <div className="card-header">
                <div className="card-title h5">{v.name}</div>
                <div className="card-subtitle text-gray">{timeSince(v.created)}</div>
              </div>
            </a>
          </div>
        )) }
      </div>
    </>
  );
}

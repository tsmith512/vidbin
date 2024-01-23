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
    console.log('running');
    // const result = await fetch('/api/get-recent-videos');
    // result.json().then(v => setVideos(v));
    setVideos(JSON.parse('[{"id":10,"video_id":"7e8ebdde9b924eb5ae28417eeea13ea6","endpoint":"https://upload.cloudflarestream.com/7e8ebdde9b924eb5ae28417eeea13ea6","name":"rawrrrrrrrrrrrrrrrrrrrrrrr","created":"2024-01-23T05:50:05.763Z","status":"ready","scheduledDeletion":"2024-02-23T05:50:04.58Z"},{"id":9,"video_id":"937dbc13bc614a9795dfa987ca4b096f","endpoint":"https://upload.cloudflarestream.com/937dbc13bc614a9795dfa987ca4b096f","name":"siiiiiiiiiiiigh","created":"2024-01-23T05:47:18.247Z","status":"ready","scheduledDeletion":"2024-02-23T05:47:17.925Z"},{"id":8,"video_id":"e976d31a4c3e4c5f90382fa71faed3c7","endpoint":"https://upload.cloudflarestream.com/e976d31a4c3e4c5f90382fa71faed3c7","name":"again and again and again","created":"2024-01-23T05:42:51.377Z","status":"ready","scheduledDeletion":"2024-02-23T05:42:51.112Z"},{"id":7,"video_id":"1e113b1f7bc84223b4863bd356ae4b9d","endpoint":"https://upload.cloudflarestream.com/1e113b1f7bc84223b4863bd356ae4b9d","name":"more fixes ","created":"2024-01-23T05:38:06.648Z","status":"ready","scheduledDeletion":"2024-02-23T05:38:06.197Z"},{"id":6,"video_id":"6614c0e2b9e84996aeae2a9c7e8517f6","endpoint":"https://upload.cloudflarestream.com/6614c0e2b9e84996aeae2a9c7e8517f6","name":"and with a way to grab the id","created":"2024-01-23T05:35:14.960Z","status":"ready","scheduledDeletion":"2024-02-23T05:35:14.642Z"},{"id":5,"video_id":"fe3bcea491854c5481dc33769d8f5fbf","endpoint":"https://upload.cloudflarestream.com/fe3bcea491854c5481dc33769d8f5fbf","name":"first one with our status handler","created":"2024-01-23T05:27:07.725Z","status":"ready","scheduledDeletion":"2024-02-23T05:27:07.438Z"},{"id":4,"video_id":"e5bdba08437c43cebcac934680a17e5e","endpoint":"https://upload.cloudflarestream.com/e5bdba08437c43cebcac934680a17e5e","name":"and another","created":"2024-01-23T05:10:43.876Z","status":"ready","scheduledDeletion":"2024-02-23T05:10:43.528Z"},{"id":3,"video_id":"453a7d139a57473fbe6d58f6201e0bec","endpoint":"https://upload.cloudflarestream.com/453a7d139a57473fbe6d58f6201e0bec","name":"testing while watching for webjhooks","created":"2024-01-23T04:51:13.647Z","status":"ready","scheduledDeletion":"2024-02-23T04:51:13.274Z"},{"id":2,"video_id":"d8a41a7a13654762b13987ec9b3b6cb1","endpoint":"https://upload.cloudflarestream.com/d8a41a7a13654762b13987ec9b3b6cb1","name":"test with webhook in place","created":"2024-01-23T04:46:57.488Z","status":"ready","scheduledDeletion":"2024-02-23T04:46:56.868Z"},{"id":1,"video_id":"dfe8d3434fe74a34bee7ed90eb1f0c02","endpoint":"https://upload.cloudflarestream.com/dfe8d3434fe74a34bee7ed90eb1f0c02","name":"boothby","created":"2024-01-23T04:13:25.225Z","status":"TEST","scheduledDeletion":"2024-02-23T04:13:24.777Z"}]'));
  };

  useEffect(() => {
    console.log('callback');
    getRecentVideos();
  }, []);

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
        { videos.map(v => (
          <div className="column col-4 col-md-6 col-xs-12" key={v.id}>
            <a onClick={() => { router.push(`/view/${v.id}`); }} className="card">
              <div className="card-image">
                <img className="img-responsive" src={`https://cloudflarestream.com/${v.video_id}/thumbnails/thumbnail.gif`} />
              </div>
              <div className="card-header">
                <div className="card-title h5">{v.name}</div>
                <div className="card-subtitle text-gray">{v.created}</div>
              </div>
            </a>
          </div>
        )) }
      </div>
    </>
  );
}

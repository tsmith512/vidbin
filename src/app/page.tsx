'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { UploadForm } from '@/components/UploadForm';
import { WebcamForm } from '@/components/WebcamForm';

interface uploadHandlerProps {
  name: string;
  file: Blob | File;
}

enum sources {
  file = 'file',
  webcam = 'webcam',
}

export default function Home() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [inputSource, setInputSource] = useState<sources>(sources.file);

  const uploadHandler = async (input: uploadHandlerProps): Promise<void> => {
    // @TODO: Check for file-size. Current request is a 200MB max basic upload URL
    setUploading(true);

    // Query a server-side function to provision us a direct upload URL
    const response = await fetch('/api/stream/get-direct-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input.name }),
    });
    const data = await response.json();

    if (!response.ok) {
      alert('Failed to get a direct upload URL. Aborting.');
      return;
    }

    const submission = new FormData();
    submission.append('name', input.name);
    submission.append('file', input.file);

    const result = await fetch(data.endpoint, {
      method: 'POST',
      body: submission,
    });

    if (result.ok) {
      router.push(`/view/${data.video_id}`);
    }
  };

  const inputStage = () => (
    <>
      <div className="accordion">
        <input
          onClick={() => setInputSource(sources.file)}
          type="radio"
          id="fileSource"
          name="inputSource"
          hidden
        />
        <label className="accordion-header" htmlFor="fileSource">
          <i className="icon icon-arrow-right mr-1"></i>
          File Upload
        </label>
        <div className="accordion-body">
          {inputSource === sources.file && <UploadForm uploadHandler={uploadHandler} />}
        </div>
      </div>
      <div className="accordion">
        <input
          onClick={() => setInputSource(sources.webcam)}
          type="radio"
          id="webcamSource"
          name="inputSource"
          hidden
        />
        <label className="accordion-header" htmlFor="webcamSource">
          <i className="icon icon-arrow-right mr-1"></i>
          Webcam Recording
        </label>
        <div className="accordion-body">
          {inputSource === sources.webcam && <WebcamForm uploadHandler={uploadHandler} />}
        </div>
      </div>
    </>
  );

  const uploadingStage = () => (
    <>
      <div className="empty" style={{ backgroundColor: 'transparent' }}>
        <div className="loading loading-lg"></div>
        <p className="empty-title h5">Uploading...</p>
      </div>
    </>
  );

  return (
    <>
      <h2>Upload a video</h2>
      {uploading ? uploadingStage() : inputStage()}
    </>
  );
}

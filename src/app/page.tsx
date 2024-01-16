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
      <h3>
        <button
          onClick={() => {
            setInputSource(sources.file);
          }}
        >
          File Upload
        </button>
      </h3>
      {inputSource === sources.file && <UploadForm uploadHandler={uploadHandler} />}
      <h3>
        <button
          onClick={() => {
            setInputSource(sources.webcam);
          }}
        >
          Webcam Capture
        </button>
      </h3>
      {inputSource === sources.webcam && <WebcamForm uploadHandler={uploadHandler} />}
    </>
  );

  return (
    <>
      <h2>Upload a video</h2>
      {uploading ? 'Uploading' : inputStage()}
    </>
  );
}

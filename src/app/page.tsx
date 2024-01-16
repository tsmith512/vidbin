'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { UploadForm } from '@/components/UploadForm';
import { WebcamForm } from '@/components/WebcamForm';

interface uploadHandlerProps {
  name: string,
  file: Blob | File,
}

export default function Home() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  // @TODO: Fighting with the type of this handler...
  const uploadHandler = async (input: uploadHandlerProps): Promise<void> => {
    // @TODO: Check for file-size. Current request is a 200MB max basic upload URL

    // Query a server-side function to provision us a direct upload URL
    const response = await fetch('/api/stream/get-direct-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input.name }),
    });
    const data = await response.json();

    setUploading(true);

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
  return (
    <>
      <div>
        <h2>Upload a video</h2>
        <h3>File Upload</h3>
        {uploading || <UploadForm uploadHandler={uploadHandler} />}
        {uploading && 'Uploading...'}
        <h3>Webcam Capture</h3>
        <WebcamForm uploadHandler={uploadHandler} />
      </div>
    </>
  );
}

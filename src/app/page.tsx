'use client';

import { useRouter } from 'next/navigation'

import { UploadForm } from '@/components/UploadForm';

export default function Home() {
  const router = useRouter();

  // @TODO: Fighting with the type of this handler...
  const uploadHandler = async (event: any): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.target);

    for (const field of formData.entries()) {
      console.log('Field: ' + field[0]);
      console.log(field[1]);
    }

    // @TODO: Check for file-size. Current request is a 200MB max basic upload URL

    // Query a server-side function to provision us a direct upload URL
    const response = await fetch('/api/stream/get-direct-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.get('name') }),
    });
    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      alert('Failed to get a direct upload URL. Aborting.');
      return;
    }

    const result = await fetch(data.endpoint, {
      method: 'POST',
      body: formData,
    });

    if (result.ok) {
      alert(`Uploaded video`);
      router.push(`/view/${data.video_id}`);
    }
  };
  return (
    <>
      <div>
        <h2>Upload a video</h2>
        <h3>File Upload</h3>
        <UploadForm uploadHandler={uploadHandler} />
        <h3>Webcam Capture</h3>
      </div>
    </>
  );
}

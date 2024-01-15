'use client';

import { UploadForm } from '@/components/UploadForm';

export default function Home() {
  const uploadHandler = async (event: any): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.target);

    for (const field of formData.entries()) {
      console.log('Field: ' + field[0]);
      console.log(field[1]);
    }

    const endpoint = await fetch('/api/stream/get-direct-upload-url');

    console.log(await endpoint.text());
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

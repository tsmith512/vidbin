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

    if (!response.ok) {
      alert('Failed to get a direct upload URL. Aborting.');
      return;
    }

    // Get our endpoint from the VidBin API response:
    const data = await response.json();
    console.log(`Received direct upload URL: ${data.endpoint}`)

    // Build a FormData to submit on:
    const submission = new FormData();
    submission.append('name', input.name);

    // We create a new File() here because we want to set the name of it to the
    // value in the form field. Otherwise it'll use the filename or be called
    // "blob" if it came from the webcam recorder.
    submission.append(
      'file',
      new File([input.file], input.name, { type: input.file.type })
    );

    console.log(submission);

    const result = await fetch(data.endpoint, {
      method: 'POST',
      body: submission,
    });

    console.log(result);

    // Watch out! We're looking for an `ok` from the Stream Direct Upload endpoint
    // but using the VidBin API's response (`data`) for the ID of the new page.
    if (result.ok) {
      router.push(`/view/${data.id}`);
    } else {
      alert(`Direct upload failed: ${result.status} ${result.statusText}`);
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

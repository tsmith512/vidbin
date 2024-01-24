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
  const [uploadingMessages, setUploadingMessages] = useState<string[]>([]);
  const [inputSource, setInputSource] = useState<sources>(sources.file);

  const uploadHandler = async (input: uploadHandlerProps): Promise<void> => {
    // @TODO: Check for file-size. Current request is a 200MB max basic upload URL
    setUploading(true);

    // Educational: explain what's happening below the form:
    setUploadingMessages(['Upload handler called']);
    setUploadingMessages((previously) => [
      ...previously,
      'Asking VidBin server for a direct upload URL.',
    ]);

    // Query a server-side function to provision us a direct upload URL
    const response = await fetch('/api/stream/get-direct-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input.name }),
    });

    // If VidBin errored on us, we don't have a Direct Upload endpoint to send
    // this file to and/or we probably also don't have a row in VidBin's DB.
    if (!response.ok) {
      const fullTextResponse = await response.text();
      setUploadingMessages((previously) => [
        ...previously,
        `VidBin API returned ${response.status} ${response.statusText}: ${fullTextResponse}`,
      ]);
      setUploading(false);
      return;
    }

    // Get our endpoint from the VidBin API response and explain.
    const data = await response.json();
    setUploadingMessages((previously) => [
      ...previously,
      `VidBin ID will be ${data.id}. Stream ID will be ${data.video_id}.`,
    ]);
    setUploadingMessages((previously) => [
      ...previously,
      `Stream Direct Upload URL: ${data.endpoint}`,
    ]);

    // Build a FormData to submit on:
    setUploadingMessages((previously) => [
      ...previously,
      `Setting up direct upload payload.`,
    ]);
    const submission = new FormData();
    submission.append('name', input.name);

    // We create a new File() here because we want to set the name of it to the
    // value in the form field. Otherwise it'll use the filename from the user's
    // actual storage, or it'll be called "blob" if it came from the webcam
    // recorder. If the file is submitted without a name at all, it can cause
    // an error on the upload endpoint, so we coalesce down to today's date.
    const filename = input.name ?? new Date().toDateString();
    submission.append(
      'file',
      new File([input.file], filename, { type: input.file.type })
    );

    setUploadingMessages((previously) => [...previously, `Starting transfer.`]);

    // This is a post of our file/filename to Stream directly. This way VidBin
    // doesn't have to handle proxying or storing the video file itself. Keeps
    // our side "lean," and we did it without exposing Stream API secrets to
    // end-user devices.
    const result = await fetch(data.endpoint, {
      method: 'POST',
      body: submission,
    });

    setUploadingMessages((previously) => [
      ...previously,
      `Transfer response: ${result.status} ${result.statusText}`,
    ]);
    console.log(result);

    // Watch out! We're looking for an `ok` from the Stream Direct Upload endpoint
    // but using the VidBin API's response (`data`) for the ID of the new page.
    if (result.ok) {
      setUploadingMessages((previously) => [...previously, `Loading viewer`]);
      router.push(`/view/${data.id}`);
    } else {
      const fullResponse = await result.text();
      setUploadingMessages((previously) => [
        ...previously,
        `Upload failed. Stream responses ${result.status} ${result.statusText}: ${fullResponse}`,
      ]);
      setUploading(false);
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
          Upload a Video File
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
          Record with Camera
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

      {uploadingMessages.length > 0 && (
        <div className="upload-progress">
          <div
            className="divider text-center upload-progress-divider"
            data-content="UNDER THE HOOD"
            style={{ margin: '2rem 0' }}
          ></div>

          <ul className="upload-progress-messages">
            {uploadingMessages.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

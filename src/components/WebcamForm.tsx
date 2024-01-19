'use client';

import React, { useEffect, useRef, useState } from 'react';

interface webcamFormProps {
  // @TODO: Fix type here
  uploadHandler: (event: any) => Promise<void>;
}

export const WebcamForm = (props: webcamFormProps) => {
  const [recording, setRecording] = useState(false);
  const [file, setFile] = useState<Blob | null>(null);
  const webcamPreview = useRef<HTMLVideoElement>(null);
  const dataBuffer = useRef<Blob[] | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const nameField = useRef<HTMLInputElement | null>(null);

  const startRecording = (e: React.MouseEvent) => {
    e.preventDefault();

    dataBuffer.current = [];
    recorder.current?.stop();
    recorder.current = null;

    // We're replaying a recording we already have
    if (webcamPreview.current && webcamPreview.current.src) {
      setupLivePreview();
    }

    if (stream.current) {
      setRecording(true);
      recorder.current = new MediaRecorder(stream.current);

      recorder.current.ondataavailable = (e) => {
        if (dataBuffer.current) {
          dataBuffer.current.push(e.data);
        }
      };

      recorder.current.start();

      recorder.current.onstop = (e) => {
        const data = dataBuffer.current || [];
        if (data?.length > 0 && webcamPreview.current) {
          const recording = new Blob(data, { type: 'video/webm' });
          setFile(recording);
          webcamPreview.current.srcObject = null;
          webcamPreview.current.src = URL.createObjectURL(recording);
          webcamPreview.current.controls = true;
        }
      };
    }
  };

  const stopRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    if (recorder.current) {
      recorder.current.stop();
    }
    setRecording(false);
  };

  const setupLivePreview = async () => {
    if (webcamPreview.current) {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      webcamPreview.current.srcObject = stream.current;
      webcamPreview.current.controls = false;
    }
  };

  // On initial component render, start the preview
  useEffect(() => {
    setupLivePreview();

    // And if this component unmounts (switching to file input or uploading)
    // turn off the preview stream and camera.
    // @TODO: ...but my computer's webcam light stays on...
    return () => {
      if (recorder.current) {
        recorder.current.stop();
      }

      if (stream.current) {
        stream.current.getTracks().forEach((t) => {
          t.stop();
        });
        stream.current = null;
      }
    };
  }, []);

  const uploadPrep = (e: React.FormEvent) => {
    e.preventDefault();

    props.uploadHandler({
      name: nameField.current?.value || '',
      file,
    });
  };

  return (
    <form onSubmit={uploadPrep}>
      <div className="form-group">
        <label htmlFor="nameInput" className="form-label">
          Name
        </label>
        <input
          ref={nameField}
          className="form-input"
          type="text"
          name="name"
          id="nameInput"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Recording:</label>
        <div className="columns">
          <div className="column col-6 col-md-12 text-center video-buttons">
            <button
              className="btn btn-secondary"
              onClick={startRecording}
              disabled={recording}
            >
              Record
            </button>
            <button
              className="btn btn-secondary"
              onClick={stopRecording}
              disabled={!recording}
            >
              Stop
            </button>
          </div>
          <div className="column col-6 col-md-12">
            <video ref={webcamPreview} autoPlay muted loop className="video-preview" />
          </div>
        </div>
      </div>
      <div className="form-group text-center">
        <button type="submit" name="submit" className="btn btn-primary">
          <i className="icon icon-upload"></i> Upload
        </button>
      </div>
    </form>
  );
};

'use client';

import React, { useRef } from 'react';

interface uploadFormProps {
  // @TODO: Fix type here
  uploadHandler: (event: any) => Promise<void>;
}

export const UploadForm = (props: uploadFormProps) => {
  const nameField = useRef<HTMLInputElement | null>(null);
  const fileField = useRef<HTMLInputElement | null>(null);

  const uploadPrep = (e: React.FormEvent) => {
    e.preventDefault();

    props.uploadHandler({
      name: nameField.current?.value || '',
      file: fileField.current?.files || undefined,
    });
  };
  return (
    <form onSubmit={props.uploadHandler}>
      <label>
        <span>Name:</span>
        <input ref={nameField} type="text" name="name" id="nameInput" />
      </label>
      <label>
        <span>File:</span>
        <input ref={fileField} type="file" name="file" id="fileInput" />
      </label>
      <div>
        <input type="submit" name="submit" value="Upload" />
      </div>
    </form>
  );
};

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
      <div className="form-group">
        <label className="form-label" htmlFor="nameInput">
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
        <label className="form-label" htmlFor="fileInput">
          File
        </label>
        <input
          ref={fileField}
          className="form-input"
          type="file"
          name="file"
          id="fileInput"
        />
      </div>
      <div className="form-group text-center">
        <button type="submit" name="submit" className="btn btn-primary">
          <i class="icon icon-upload"></i> Upload
        </button>
      </div>
    </form>
  );
};

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

    // A file field "files" prop is an array, but the parent upload handler
    // wants just the one field provided.
    let targetFile = false as File | false;
    if (fileField.current?.files?.length) {
      targetFile = fileField.current.files[0];
    }

    if (!targetFile) {
      alert('No file selected.');
      return;
    }

    props.uploadHandler({
      name: nameField.current?.value || '',
      file: targetFile || undefined,
    });
  };
  return (
    <form onSubmit={uploadPrep}>
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
          required
        />
      </div>
      <div className="form-group text-center">
        <button type="submit" name="submit" className="btn btn-primary">
          <i className="icon icon-upload"></i> Upload
        </button>
      </div>
    </form>
  );
};

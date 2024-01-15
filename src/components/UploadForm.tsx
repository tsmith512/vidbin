'use client';

interface uploadFormProps {
  // @TODO: Fix type here
  uploadHandler: (event: any) => Promise<void>;
}

export const UploadForm = (props: uploadFormProps) => {
  return (
    <form onSubmit={props.uploadHandler}>
      <label>
        <span>Name:</span>
        <input type="text" name="name" id="nameInput" />
      </label>
      <label>
        <span>File:</span>
        <input type="file" name="file" id="fileInput" />
      </label>
      <div>
        <input type="submit" name="submit" value="Upload" />
      </div>
    </form>
  );
};

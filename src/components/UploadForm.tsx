'use client';

interface uploadFormProps {
  uploadHandler: (event) => Promise<void>;
}

export const UploadForm = (props: uploadFormProps) => {
  return (
    <form onSubmit={props.uploadHandler}>
      <label>
        <span>Title:</span>
        <input type="text" name="title" id="titleInput" />
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

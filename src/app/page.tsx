import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <header>
        <h1>VidBin</h1>
        <span>A Cloudflare Stream Demo</span>
      </header>

      <div>
        <h2>Upload a video</h2>
        <h3>File Upload</h3>
        <form>
          <label>
            <span>Title:</span>
            <input type="text" name="title" id="titleInput" />
            <input type="submit" name="submit" value="Upload" />
          </label>
        </form>
        <h3>Webcam Capture</h3>
      </div>

      <div>
        <h2>View a Video</h2>
        <h3>With a Code</h3>
        <h3>What&rsquo;s Here Lately</h3>
      </div>

      <div>
        <h2>How does it work</h2>
        <p>Links to how this application handles a few basic tasks to operate.</p>
        <ul>
          <li>Provision a direct upload URL</li>
          <li>Generate a signed URL</li>
        </ul>
      </div>

      <footer>
        &copy; {new Date().getFullYear()} &bull; Created by Taylor Smith, based on an
        internal prototype by WHO MADE PASTE?
      </footer>
    </>
  );
}

export default function About() {
  return (
    <>
      <div>
        <h2>How does it work</h2>
        <p>Links to how this application handles a few basic tasks to operate.</p>
        <p>
          <a href="https://github.com/tsmith512/vidbin">Check it out on GitHub!</a>
        </p>
        <ul>
          <li>Capture video (with a file or webcam recording)</li>
          <li>Provision a direct upload URL</li>
          <li>Client direct upload to Stream</li>
          <li>Requesting video information from Stream</li>
          <li>Receive a webhook when a video is processed</li>
          <li>Display a thumbnail preview of a video</li>
          <li>Play a video with the Build-in Player</li>
        </ul>

        <h2>Acknowledgements</h2>
        <p>
          Lots of friends helped beta test as I prepared for this session. Scott and Ryan
          at Cloudflare build Paste.Video, which is where I got this idea.
        </p>
      </div>
    </>
  );
}

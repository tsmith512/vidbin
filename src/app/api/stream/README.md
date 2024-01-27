This directory contains server-side routes, each of which makes calls back to
Cloudflare Stream. I tried to name these routes as obviously as I could and
document each of them in code.

- **Get Direct Upload URL:** Provision an endpoint that a VidBin user can post
  a video to directly.
- **Get Video Info:** A proxy of video status information. Useful earlier in
  development, but once we start storing that info in our DB instead, not needed.

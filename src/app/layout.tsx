import Nav from '../components/Nav';
import type { Metadata } from 'next';

import '../styles/main.scss';

export const metadata: Metadata = {
  title: 'VidBin',
  description: 'A Cloudflare Stream Demonstration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="hero">
            <div className="hero-body text-center">
              <h1>VidBin</h1>
              <p>A Cloudflare Stream Demo</p>
            </div>
          </header>
          <section>
            <Nav />
          </section>
          <main>{children}</main>
          <footer>
            &copy; {new Date().getFullYear()} &bull; Created by TSmith &bull; Based on
            internal project Paste.Video by Scott and Ryan 🧡
          </footer>
        </div>
      </body>
    </html>
  );
}

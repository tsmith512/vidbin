import Nav from '../components/Nav';
import type { Metadata } from 'next';

import '../../node_modules/normalize.css/normalize.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'VidBin',
  description: 'A Cloudflare Stream Demonstration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <h1>VidBin</h1>
            <span>A Cloudflare Stream Demo</span>
            <Nav />
          </header>
          <main>{children}</main>
          <footer>
            &copy; {new Date().getFullYear()} &bull; Created by Taylor Smith, based on an
            internal prototype by WHO MADE PASTE?
          </footer>
        </div>
      </body>
    </html>
  );
}

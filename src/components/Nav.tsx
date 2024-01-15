'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Nav() {
  const pathname = usePathname();

  const nav = [
    {
      title: 'Upload',
      url: '/',
    },
    {
      title: 'View',
      url: '/view',
    },
    {
      title: 'About',
      url: '/about',
    },
  ];

  return (
    <nav>
      <ul>
        {nav.map((l, i) => (
          <li key={i}>
            <Link className={pathname === l.url ? 'active' : ''} href={l.url}>
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

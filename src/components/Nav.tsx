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
      <ul className='tab tab-block'>
        {nav.map((l, i) => (
          <li key={i} className={pathname === l.url ? 'tab-item active' : 'tab-item'}>
            <Link href={l.url}>
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

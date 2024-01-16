'use client';

import React, { useRef } from "react";
import { useRouter } from 'next/navigation';

export default function View() {
  const router = useRouter();
  const idField = useRef<HTMLInputElement>(null);

  const gotoVideo = (e: React.FormEvent) => {
    e.preventDefault();

    if (idField.current) {
      router.push(`/view/${idField.current.value}`);
    }
  }
  return (
    <>
      <div>
        <h2>View a Video</h2>
        <h3>With a Code</h3>
        <form onSubmit={gotoVideo}>
          <input type="text" ref={idField} />
          <input type="submit" name="submit" value="Go" />
        </form>
        <h3>What&rsquo;s Here Lately</h3>
      </div>
    </>
  );
}

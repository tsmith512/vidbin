'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function View() {
  const router = useRouter();
  const idField = useRef<HTMLInputElement>(null);

  const gotoVideo = (e: React.FormEvent) => {
    e.preventDefault();

    if (idField.current) {
      router.push(`/view/${idField.current.value}`);
    }
  };
  return (
    <>
      <h2>View a Video</h2>
      <div className="accordion">
        <input type="radio" name='viewSource' id='codeInput' hidden />
        <label className='accordion-header' htmlFor="codeInput">
          <i className='icon icon-arrow-right mr-1'></i>
          With a Code
        </label>
        <div className="accordion-body">
          <form onSubmit={gotoVideo}>
            <div className="input-group">
              <input className='form-input' type="text" ref={idField} />
              <button className='btn btn-primary input-group-btn' type='submit' name='submit'>Watch</button>
            </div>
          </form>
        </div>
      </div>
      <div className="accordion">
        <input type="radio" name='viewSource' id='recentInput' hidden />
        <label className='accordion-header' htmlFor="recentInput">
          <i className='icon icon-arrow-right mr-1'></i>
          Recent Uploads
        </label>
        <div className="accordion-body">
          <div className="empty">
            <p className="empty-title h5">No recent uploads</p>
          </div>
        </div>
      </div>
    </>
  );
}

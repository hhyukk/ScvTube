'use client';

import { useEffect, useState } from 'react';

export default function UploadPage() {
  const [videoList, setVideoList] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedVideos = localStorage.getItem('videoList');
    if (savedVideos) {
      setVideoList(JSON.parse(savedVideos));
    }
    setIsHydrated(true);
  }, []);

  return (
    <div className="upload-container">
      <h1>당신의 영상을 업로드하세요!</h1>

      <div className="video-list">
        <h2>업로드된 비디오</h2>
        {isHydrated && (
          <ul>
            {videoList.map((video) => (
              <li key={video.id} onClick={() => window.location.href = `/videos/${video.id}`}>
                <strong>제목:</strong> {video.title} <br />
                <strong>설명:</strong> {video.description} <br />
                <strong>태그:</strong> {video.tags} <br />
                <strong>업로드 시간:</strong> {video.createdAt} <br />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [videoList, setVideoList] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:4000/');
        if (!response.ok) {
          throw new Error('비디오를 불러오는 데 실패했습니다.');
        }
        const videos = await response.json();
        setVideoList(videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const formatUploadTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <div className="home-container">
      <div className="video-list">
        {videoList === null ? (
          <p>게시글을 불러오는 중입니다...</p>
        ) : videoList.length > 0 ? (
          <ul className="video-grid">
            {videoList.map((video) => (
              <li key={video._id} className="video-item">
                <a href={`/videos/${video._id}`}>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <div className="video-title">제목 : {video.title}</div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 게시된 비디오가 없습니다.</p>
        )}
      </div>
    </div>
  );  
}

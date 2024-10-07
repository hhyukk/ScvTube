'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:4000/videos');
        const videos = await response.json();
        setVideoList(videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="main-container">
      <h1>WeTube에 온 것을 환영합니다!</h1>
      <p>동영상을 쉽게 업로드하고 시청하세요!!!</p>

      <h2>업로드된 동영상</h2>
      {videoList.length > 0 ? (
        <ul>
          {videoList.map((video) => (
            <li key={video.id}>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <small>업로드 시간: {video.createdAt}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>업로드된 영상이 없습니다.</p>
      )}
    </div>
  );
}
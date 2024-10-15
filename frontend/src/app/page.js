'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:4000/'); // 비디오 리스트를 가져오는 API
        if (!response.ok) {
          throw new Error('비디오를 불러오는 데 실패했습니다.');
        }
        const videos = await response.json();
        setVideoList(videos); // 비디오 리스트에 ID 포함
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="home-container">
      <h1>게시된 비디오들</h1>
      <div className="video-list">
        {videoList.length > 0 ? (
          <ul>
            {videoList.map((video) => (
              <li key={video._id}> {/* ID는 _id로 가져옵니다 */}
                <a href={`/videos/${video._id}`}>
                  <strong>제목:</strong> {video.title} <br />
                  <strong>설명:</strong> {video.description} <br />
                  <strong>태그:</strong> {video.hashtags} <br />
                  <strong>업로드 시간:</strong> {video.createdAt} <br />
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

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

  return (
    <div className="home-container">
      <div className="home-video-list"> {/* 클래스 이름 변경 */}
        {videoList === null ? (
          <p>게시글을 불러오는 중입니다...</p>
        ) : videoList.length > 0 ? (
          <ul className="home-video-grid"> {/* 클래스 이름 변경 */}
            {videoList.map((video) => (
              <li key={video._id} className="home-video-item"> {/* 클래스 이름 변경 */}
                <a href={`/videos/${video._id}`}>
                  <video
                    controls
                    preload="auto"
                    src={`http://localhost:4000/${video.fileUrl}`} // fileUrl을 사용하여 비디오 재생
                    onError={() => alert('동영상을 불러올 수 없습니다.')}
                    className="video-player"
                  >
                    동영상을 불러올 수 없습니다.
                  </video>
                  <div className="video-title">제목: {video.title}</div>
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

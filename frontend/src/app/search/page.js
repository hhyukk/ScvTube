'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const [videoList, setVideoList] = useState(null);
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword'); // URL에서 검색어 가져오기

  useEffect(() => {
    const fetchVideos = async () => {
      if (keyword) {
        try {
          const response = await fetch(`http://localhost:4000/search?keyword=${encodeURIComponent(keyword)}`);
          if (!response.ok) {
            throw new Error('비디오를 불러오는 데 실패했습니다.');
          }
          const data = await response.json();
          setVideoList(data); // 받아온 비디오 리스트로 상태 업데이트
        } catch (error) {
          console.error('Error fetching videos:', error);
          alert('비디오를 불러오는 데 실패했습니다.');
        }
      }
    };

    fetchVideos(); // 비디오 검색 API 호출
  }, [keyword]); // keyword가 변경될 때마다 호출

  return (
    <div className="search-video-container">
      <div className="search-video-list"> {/* 클래스 이름 변경 */}
        {videoList === null ? (
          <p>게시글을 불러오는 중입니다...</p>
        ) : videoList.length > 0 ? (
          <ul className="search-video-grid"> {/* 클래스 이름 변경 */}
            {videoList.map((video) => (
              <li key={video._id} className="search-video-item"> {/* 클래스 이름 변경 */}
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

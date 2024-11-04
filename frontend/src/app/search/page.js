'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const [videoList, setVideoList] = useState([]);
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
    <div className="search-container">
      <h1>검색 결과</h1>
      <div className="video-list">
        {videoList.length > 0 ? (
          videoList.map((video) => (
            <div className="video-card" key={video._id}>
              <a href={`/videos/${video._id}`}>
                <img src={`http://localhost:4000/uploads/${video.thumbnail}`} alt={video.title} className="thumbnail" />
                <strong>제목:</strong> {video.title} <br />
              </a>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );  
}

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
      {videoList.length > 0 ? (
        <ul>
          {videoList.map((video) => (
            <li key={video._id}> {/* MongoDB에서는 _id 사용 */}
              <a href={`/videos/${video._id}`}>
                <strong>제목:</strong> {video.title} <br />
                <strong>설명:</strong> {video.description} <br />
                <strong>태그:</strong> {Array.isArray(video.hashtags) ? video.hashtags.join(', ') : video.hashtags} <br /> {/* 배열 처리 */}
                <strong>업로드 시간:</strong> {new Date(video.createdAt).toLocaleString()} <br /> {/* 날짜 형식 변환 */}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
}

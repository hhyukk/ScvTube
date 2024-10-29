'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [videoList, setVideoList] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태 추가

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('http://localhost:4000/session', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setIsLoggedIn(data.loggedIn); // 로그인 상태 업데이트
    };

    checkSession();
  }, []);

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
        {isLoggedIn ? ( // 로그인 상태에 따라 비디오 리스트 표시
          videoList === null ? (
            <p>게시글을 불러오는 중입니다...</p>
          ) : videoList.length > 0 ? (
            <ul>
              {videoList.map((video) => (
                <li key={video._id}>
                  <a href={`/videos/${video._id}`}>
                    <strong>제목:</strong> {video.title} <br />
                    <strong>설명:</strong> {video.description} <br />
                    <strong>태그:</strong> {video.hashtags} <br />
                    <strong>업로드 시간:</strong> {formatUploadTime(video.createdAt)} <br />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>아직 게시된 비디오가 없습니다.</p>
          )
        ) : null} {/* 로그인하지 않은 경우에는 아무것도 렌더링하지 않음 */}
      </div>
    </div>
  );
}

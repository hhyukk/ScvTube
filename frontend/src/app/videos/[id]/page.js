'use client';

import { useEffect, useState } from 'react';

export default function VideoPage({ params }) {
  const { id } = params;
  const [video, setVideo] = useState({
    title: '',
    description: '',
    hashtags: [],
    createdAt: '',
  });
  const [originalVideo, setOriginalVideo] = useState(null); // 원본 비디오 데이터 저장
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/videos/${id}`);
        if (!response.ok) {
          throw new Error('비디오를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setVideo({
          ...data,
          hashtags: Array.isArray(data.hashtags) ? data.hashtags.join(', ') : data.hashtags,
        });
        setOriginalVideo(data); // 원본 데이터 저장
      } catch (error) {
        console.error('Error fetching video:', error);
        alert('비디오를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  const handleEdit = async () => {
    try {
      const updatedVideo = {
        ...video,
        hashtags: video.hashtags.split(',').map(tag => tag.trim()),
      };

      const response = await fetch(`http://localhost:4000/videos/${id}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVideo),
      });

      if (response.ok) {
        alert('수정이 완료되었습니다.');
        window.location.href = '/';
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error editing video:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:4000/videos/${id}/delete`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('삭제가 완료되었습니다.');
        window.location.href = '/';
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setVideo({
      title: originalVideo.title, // 원본 제목
      description: originalVideo.description, // 원본 설명
      hashtags: Array.isArray(originalVideo.hashtags) ? originalVideo.hashtags.join(', ') : originalVideo.hashtags, // 원본 해시태그
      createdAt: originalVideo.createdAt, // 원본 업로드 시간
    });
    setIsEditing(false); // 수정 모드 해제
  };

  const formatUploadTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`; // 포맷: YYYY년 MM월 DD일 HH:MM
  };

  if (loading) {
    return <p>비디오를 불러오는 중입니다...</p>; // 로딩 상태 처리
  }

  return (
    <div className="video-container">
      <h1>비디오 상세 정보</h1>

      {!isEditing ? (
        <div>
          <p><strong>제목:</strong> {video.title}</p>
          <p><strong>설명:</strong> {video.description}</p>
          <p><strong>태그:</strong> {video.hashtags}</p>
          <p><strong>업로드 시간:</strong> {formatUploadTime(video.createdAt)}</p> {/* 업로드 시간 포맷 */}
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      ) : (
        <div>
          <div className="input-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={video.title}
              onChange={(e) => setVideo({ ...video, title: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">설명</label>
            <input
              type="text"
              id="description"
              value={video.description}
              onChange={(e) => setVideo({ ...video, description: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label htmlFor="tags">태그</label>
            <input
              type="text"
              id="tags"
              value={video.hashtags}
              onChange={(e) => setVideo({ ...video, hashtags: e.target.value })}
              placeholder="쉼표로 태그를 구분하세요"
            />
          </div>
          <button onClick={handleEdit}>저장</button>
          <button onClick={handleCancel}>취소</button>
        </div>
      )}
    </div>
  );
}

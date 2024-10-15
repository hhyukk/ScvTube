'use client';

import { useEffect, useState } from 'react';

export default function VideoPage({ params }) {
  const { id } = params; // 동적 라우팅에서 id 가져오기
  const [video, setVideo] = useState({ title: '', description: '', hashtags: [] }); // 초기값 설정
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/videos/${id}`); // API 호출
        if (!response.ok) {
          throw new Error('비디오를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setVideo(data); // 비디오 데이터 설정
      } catch (error) {
        console.error('Error fetching video:', error);
        alert('비디오를 불러오는 데 실패했습니다.');
      }
    };

    fetchVideo();
  }, [id]); // ID가 변경될 때마다 호출

  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:4000/videos/${id}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(video), // 수정된 비디오 데이터 서버로 전송
      });

      if (response.ok) {
        alert('수정이 완료되었습니다.');
        window.location.href = '/'; // 수정 완료 후 홈으로 리디렉션
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
        window.location.href = '/'; // 삭제 후 홈으로 리디렉션
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="video-container">
      <h1>비디오 상세 정보</h1>

      {!isEditing ? (
        <div>
          <p><strong>제목:</strong> {video.title}</p>
          <p><strong>설명:</strong> {video.description}</p>
          <p><strong>태그:</strong> {Array.isArray(video.hashtags) ? video.hashtags.join(', ') : video.hashtags}</p> {/* 배열인지 확인 */}
          <button onClick={() => setIsEditing(true)}>수정</button> {/* 수정 모드로 전환 */}
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
              value={video.hashtags.join(', ')} // 태그를 문자열로 표시
              onChange={(e) => setVideo({ ...video, hashtags: e.target.value.split(',').map(tag => tag.trim()) })} // 문자열을 배열로 변환
            />
          </div>
          <button onClick={handleEdit}>저장</button> {/* 수정 사항 저장 */}
          <button onClick={() => setIsEditing(false)}>취소</button> {/* 수정 모드 취소 */}
        </div>
      )}
    </div>
  );
}

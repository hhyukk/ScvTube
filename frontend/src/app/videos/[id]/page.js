'use client';

import { useEffect, useState } from 'react';

export default function VideoPage({ params }) {
  const { id } = params;
  const [video, setVideo] = useState({
    title: '',
    description: '',
    hashtags: '',
    createdAt: '',
    filename: '',
  });
  const [originalVideo, setOriginalVideo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/videos/${id}`);
        if (!response.ok) {
          throw new Error('비디오를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setVideo({
          title: data.title,
          description: data.description,
          hashtags: Array.isArray(data.hashtags) ? data.hashtags.join(', ') : data.hashtags,
          createdAt: data.createdAt,
          filename: data.filename,
        });
        setOriginalVideo(data);

        console.log(`Video URL: http://localhost:4000/uploads/${data.filename}`);
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
      title: originalVideo.title,
      description: originalVideo.description,
      hashtags: Array.isArray(originalVideo.hashtags) ? originalVideo.hashtags.join(', ') : originalVideo.hashtags,
      createdAt: originalVideo.createdAt,
      filename: originalVideo.filename,
    });
    setIsEditing(false);
  };

  const formatUploadTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

  if (loading) {
    return <p>비디오를 불러오는 중입니다...</p>;
  }

  return (
    <div className="video-container">
      <h1>비디오 상세 정보</h1>
  
      {!isEditing ? (
        <div>
          <video
            controls
            preload="auto"
            src={`http://localhost:4000/uploads/${video.filename}`}
            onError={() => alert('동영상을 불러올 수 없습니다.')}
          >
            동영상을 불러올 수 없습니다.
          </video>
          
          <div className="video-details">
            <p><strong>제목:</strong> {video.title}</p>
            <p><strong>설명:</strong> {video.description}</p>
            <p><strong>태그:</strong> {video.hashtags}</p>
            <p><strong>업로드 시간:</strong> {formatUploadTime(video.createdAt)}</p>
          </div>
          
          <div className="edit-delete-buttons">
            <button className="button edit-button" onClick={() => setIsEditing(true)}>수정</button>
            <button className="button delete-button" onClick={handleDelete}>삭제</button>
          </div>
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
          <div className="button-container">
            <button className="button save-button" onClick={handleEdit}>저장</button>
            <button className="button cancel-button" onClick={handleCancel}>취소</button>
          </div>
        </div>
      )}
    </div>
  );    
}

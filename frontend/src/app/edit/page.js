'use client';

import { useState, useEffect } from 'react';

export default function EditVideoPage({ params }) {
  const { id } = params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/videos/${id}`);
        const video = await response.json();
        setTitle(video.title);
        setDescription(video.description);
        setTags(video.tags);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, [id]);

  const handleUpdate = async () => {
    const updatedVideo = {
      title,
      description,
      tags,
    };

    try {
      const response = await fetch(`http://localhost:4000/videos/${id}/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVideo),
      });

      if (response.ok) {
        alert('영상 정보가 성공적으로 수정되었습니다!');
        window.location.href = '/';
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="edit-video-container">
      <h1>영상 수정</h1>

      <div className="input-group">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className="input-group">
        <label htmlFor="description">설명</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 입력하세요"
        />
      </div>

      <div className="input-group">
        <label htmlFor="tags">태그</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그를 입력하세요(#)"
        />
      </div>

      <button className="update-button" onClick={handleUpdate}>
        Update Video
      </button>
    </div>
  );
}
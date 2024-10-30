'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleUpload = async () => {
    if (!title || !description || !tags) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    const newVideo = {
      id: Date.now(),
      title,
      description,
      hashtags: tags, // 해시태그를 hashtags로 수정
      createdAt: new Date().toLocaleString(),
    };

    try {
      const response = await fetch('http://localhost:4000/videos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVideo),
      });

      const result = await response.json();
      if (response.ok) {
        // 홈 페이지로 리디렉션
        window.location.href = '/';
      } else {
        alert('업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="upload-container">
      <h1>영상 업로드</h1>
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
      <button className="upload-button" onClick={handleUpload}>
        Upload Video
      </button>
    </div>
  );
}
'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null); // 비디오 파일 상태 추가

  const handleUpload = async () => {
    if (!title || !description || !tags || !videoFile) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    const formData = new FormData(); // FormData 객체 생성
    formData.append('video', videoFile); // 비디오 파일 추가
    formData.append('title', title); // 제목 추가
    formData.append('description', description); // 설명 추가
    formData.append('hashtags', tags); // 해시태그 추가

    try {
      const response = await fetch('http://localhost:4000/videos/upload', {
        method: 'POST',
        body: formData, // FormData를 요청 본문으로 전송
        credentials: 'include', // 세션 쿠키 전송 허용
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
      <div className="input-group">
        <label htmlFor="videoFile">동영상 파일</label>
        <input
          type="file"
          id="videoFile"
          accept="video/*" // 비디오 파일만 선택 가능
          onChange={(e) => setVideoFile(e.target.files[0])} // 선택된 파일을 상태에 저장
        />
      </div>
      <button className="upload-button" onClick={handleUpload}>
        Upload Video
      </button>
    </div>
  );
}

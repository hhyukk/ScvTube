'use client';

import { useState, useEffect } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoList, setVideoList] = useState([]);

  //파일 변경 핸들러
  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!title || !description || !tags || !videoFile) {
      alert('모든 필드를 입력하고 비디오 파일을 추가하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hashtags', tags);
    formData.append('video', videoFile);

    try {
      const response = await fetch('http://localhost:4000/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('업로드가 성공적으로 완료되었습니다!');
        fetchVideos(); // 업로드 후 비디오 리스트 다시 불러오기
      } else {
        alert('업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('업로드 중 에러 발생:', error);
      alert('업로드 중 문제가 발생했습니다.');
    }
  };

  // 서버에서 비디오 리스트 불러오기
  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:4000/');
      const data = await response.json();
      setVideoList(data);
    } catch (error) {
      console.error('비디오 리스트를 불러오는 중 에러 발생:', error);
    }
  };

  // 페이지 로드 시 비디오 리스트 불러오기
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="upload-container">
      <h1>당신의 영상을 업로드하세요!</h1>

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
        <label htmlFor="videoFile">파일</label>
        <input
          type="file"
          id="videoFile"
          accept="video/*"
          onChange={handleFileChange}
        />
        {videoFile && <p>선택된 파일: {videoFile.name}</p>}
      </div>

      <button className="upload-button" onClick={handleUpload}>
        Upload Video
      </button>
    </div>
  );
}
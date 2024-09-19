'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!title || !tags || !videoFile) {
      alert('Please fill in all fields and add a video file.');
      return;
    }
    alert('업로드가 되었습니다!!!');
  };

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
        {videoFile && <p>Selected file: {videoFile.name}</p>}
      </div>

      <button className="upload-button" onClick={handleUpload}>
        Upload Video
      </button>
    </div>
  );
}
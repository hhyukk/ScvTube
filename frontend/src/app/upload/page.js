'use client';

import { useState, useEffect } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  // const [videoFile, setVideoFile] = useState(null); // 파일 관련 코드 주석 처리
  const [videoList, setVideoList] = useState([]);

  // 파일 변경 핸들러 주석 처리
  // const handleFileChange = (event) => {
  //   setVideoFile(event.target.files[0]);
  // };

  const handleUpload = () => {
    if (!title || !description || !tags) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    const newVideo = {
      title,
      description,
      tags,
      createdAt: new Date().toLocaleString(), // 현재 시간을 등록
    };

    setVideoList((prevList) => [...prevList, newVideo]);

    // 입력 후 필드 초기화
    setTitle('');
    setDescription('');
    setTags('');
    alert('업로드가 성공적으로 완료되었습니다!');
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

      {/* 파일 업로드 부분 주석 처리 */}
      {/* <div className="input-group">
        <label htmlFor="videoFile">파일</label>
        <input
          type="file"
          id="videoFile"
          accept="video/*"
          onChange={handleFileChange}
        />
        {videoFile && <p>선택된 파일: {videoFile.name}</p>}
      </div> */}

      <button className="upload-button" onClick={handleUpload}>
        Upload Video
      </button>

      {/* 등록된 비디오 리스트를 출력 */}
      <div className="video-list">
        <h2>업로드된 비디오</h2>
        <ul>
          {videoList.map((video, index) => (
            <li key={index}>
              <strong>제목:</strong> {video.title} <br />
              <strong>설명:</strong> {video.description} <br />
              <strong>태그:</strong> {video.tags} <br />
              <strong>업로드 시간:</strong> {video.createdAt} <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

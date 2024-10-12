'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const router = useRouter();

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!title || !description || !tags) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    const newVideo = {
      id: Date.now(),
      title,
      description,
      tags,
      createdAt: new Date().toLocaleString(),
    };

    // 비디오 리스트에 새 비디오 추가
    setVideoList((prevList) => [...prevList, newVideo]);

    // 비디오 업로드 로직 (파일 업로드는 주석처리됨)
    /*
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('file', videoFile);

    try {
      const response = await fetch('http://localhost:4000/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('업로드가 성공적으로 완료되었습니다!');
        setTitle('');
        setDescription('');
        setTags('');
        setVideoFile(null);
      } else {
        alert('업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('업로드 중 오류가 발생했습니다.');
    }
    */

    alert('게시물이 성공적으로 추가되었습니다!');
    // 제목, 설명, 태그 초기화
    setTitle('');
    setDescription('');
    setTags('');
  };

  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;

    // 비디오 삭제 로직
    setVideoList((prevList) => prevList.filter((video) => video.id !== videoId));
    alert('영상이 성공적으로 삭제되었습니다.');
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

      {/* 비디오 파일 업로드 부분은 주석처리됨 */}
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
        게시물 올리기
      </button>

      <div className="video-list">
        <h2>업로드된 비디오</h2>
        <ul>
          {videoList.map((video) => (
            <li key={video.id}>
              <strong>제목:</strong> {video.title} <br />
              <strong>설명:</strong> {video.description} <br />
              <strong>태그:</strong> {video.tags} <br />
              <strong>업로드 시간:</strong> {video.createdAt} <br />
              <button onClick={() => router.push(`/videos/${video.id}/edit`)}>수정</button>
              <button onClick={() => handleDelete(video.id)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

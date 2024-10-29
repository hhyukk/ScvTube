'use client';

import { useState, useEffect } from 'react';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    location: '',
  });

  useEffect(() => {
    // 초기 정보 불러오기
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:4000/session', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        // 현재 정보를 placeholder로 설정
        if (data.loggedIn && data.user) {
          setFormData({
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            location: data.user.location,
          });
        }
      } catch (error) {
        console.error('프로필 정보를 가져오는 중 오류:', error);
      }
    };

    fetchProfileData();
  }, []);

  // 입력 값 변경 핸들러
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 프로필 업데이트 함수
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('http://localhost:4000/users/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('프로필이 업데이트되었습니다.');
      } else {
        console.error('프로필 업데이트 실패');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류:', error);
    }
  };

  return (
    <div className="edit-profile">
      <h2>프로필 수정</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          이름
          <input
            type="text"
            name="name"
            placeholder={formData.name}
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          이메일
          <input
            type="email"
            name="email"
            placeholder={formData.email}
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          유저네임
          <input
            type="text"
            name="username"
            placeholder={formData.username}
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
        <label>
          지역
          <input
            type="text"
            name="location"
            placeholder={formData.location}
            value={formData.location}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleUpdateProfile}>
          수정하기
        </button>
      </form>
    </div>
  );
}

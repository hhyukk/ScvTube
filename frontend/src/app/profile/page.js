'use client';

import { useState, useEffect } from 'react';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    location: '',
    avatarUrl: '',
  });
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });
  const [sessionPassword, setSessionPassword] = useState(''); // 세션에서 가져온 비밀번호 저장

  useEffect(() => {
    // 초기 정보 불러오기
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:4000/session', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (data.loggedIn && data.user) {
          setFormData({
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            location: data.user.location,
            avatarUrl: data.user.avatarUrl || '',
          });
          setSessionPassword(data.user.password); // 세션에서 비밀번호 저장
        }
      } catch (error) {
        console.error('프로필 정보를 가져오는 중 오류:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.newPasswordConfirmation) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        alert('비밀번호가 변경되었습니다.');
        setIsEditingPassword(false);
        setPasswordData({ oldPassword: '', newPassword: '', newPasswordConfirmation: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || '비밀번호 변경 실패');
      }
    } catch (error) {
      console.error('비밀번호 업데이트 중 오류:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', newPasswordConfirmation: '' });
    setFormData({
      name: '',
      email: '',
      username: '',
      location: '',
      avatarUrl: '',
    });
    // 초기 데이터로 복원하려면 다시 세션에서 불러와야 할 수 있습니다.
  };

  return (
    <div className="edit-profile">
      <h2>프로필 수정</h2>
      <form onSubmit={(e) => e.preventDefault()} className="profile-form">
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
          프로필 이미지 URL
          <input
            type="text"
            name="avatarUrl"
            placeholder={formData.avatarUrl}
            value={formData.avatarUrl}
            onChange={handleInputChange}
          />
        </label>

        {/* 비밀번호 표시 */}
        <label className="password-field">
          비밀번호
          {isEditingPassword ? (
            <>
              <input
                type="password"
                name="oldPassword"
                placeholder="기존 비밀번호"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="password-input"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="새 비밀번호"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="password-input"
              />
              <input
                type="password"
                name="newPasswordConfirmation"
                placeholder="새 비밀번호 확인"
                value={passwordData.newPasswordConfirmation}
                onChange={handlePasswordChange}
                className="password-input"
              />
              <button type="button" onClick={handleUpdatePassword} className="save-button">
                변경
              </button>
              <button type="button" onClick={handleCancelEdit} className="cancel-button">
                취소
              </button>
            </>
          ) : (
            <div className="password-display">
              <input
                type="password"
                value="********"
                disabled
                className="password-input"
              />
              <button
                type="button"
                onClick={() => setIsEditingPassword(true)}
                className="edit-password-button"
              >
                비밀번호 변경하기
              </button>
            </div>
          )}
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

        <button type="button" onClick={handleUpdateProfile} className="save-button">
          수정하기
        </button>
      </form>
    </div>
  );
}

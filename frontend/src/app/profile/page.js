'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    location: '',
    avatarUrl: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });

  useEffect(() => {
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
            avatarUrl: data.user.avatarUrl, // fileUrl 대신 avatarUrl 사용
          });
          // 기존 이미지가 있을 경우 previewUrl 설정
          if (data.user.avatarUrl) {
            setPreviewUrl(`http://localhost:4000/${data.user.avatarUrl.replace(/\\/g, '/')}`);
          } else {
            setPreviewUrl('/default-avatar.png'); // 기본 이미지 URL 설정
          }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // 파일 선택 시 미리보기
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('location', formData.location);

    // 아바타 파일이 있는 경우 FormData에 추가
    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    }

    try {
      const response = await fetch('http://localhost:4000/users/edit', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('프로필이 업데이트되었습니다.');
        router.push('/'); // 홈으로 이동
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

  const handleCancelPasswordEdit = () => {
    setIsEditingPassword(false); // 비밀번호 입력 필드를 숨김
  };

  return (
    <div className="edit-profile">
      <h2>프로필 수정</h2>
      <form onSubmit={(e) => e.preventDefault()} className="profile-form">
        <div className="profile-image-container">
          <label htmlFor="avatarUpload">
            <img src={previewUrl || '/default-avatar.png'} alt="프로필 미리보기" className="profile-preview" />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="avatarUpload"
            style={{ display: 'none' }}
          />
        </div>

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
              <div className="button-group">
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  className="save-button"
                >
                  비밀번호 저장
                </button>
                <button
                  type="button"
                  onClick={handleCancelPasswordEdit}
                  className="cancel-button"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingPassword(true)}
              className="edit-password-button"
            >
              비밀번호 변경하기
            </button>
          )}
        </label>

        <div className="button-group">
          <button type="button" onClick={handleUpdateProfile} className="save-button">
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}

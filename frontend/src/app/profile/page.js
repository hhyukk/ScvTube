'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    location: '',
    avatarUrl: '',
  });
  const [videos, setVideos] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const [userId, setUserId] = useState(null);

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
            avatarUrl: data.user.avatarUrl,
          });

          setUserId(data.user._id);

          if (data.user.avatarUrl) {
            setPreviewUrl(`http://localhost:4000/${data.user.avatarUrl.replace(/\\/g, '/')}`);
          } else {
            setPreviewUrl('/default-avatar.png');
          }
        }
      } catch (error) {
        console.error('프로필 정보를 가져오는 중 오류:', error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchVideos = async () => {
        try {
          const response = await fetch(`http://localhost:4000/users/${userId}`);
          const data = await response.json();

          if (data.videos) {
            setVideos(data.videos);
          }
        } catch (error) {
          console.error('비디오 데이터를 가져오는 중 오류:', error);
        }
      };

      fetchVideos();
    }
  }, [userId]);

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
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('location', formData.location);

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
        router.push('/');
      } else {
        console.error('프로필 업데이트 실패');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류:', error);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    setIsEditingPassword(false);
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

        <div className="uploaded-videos">
          <h3>내가 올린 영상</h3>
          {videos.length === 0 ? (
            <p>업로드한 영상이 없습니다.</p>
          ) : (
            <ul>
              {videos.map((video) => (
                <li key={video._id}>
                  <Link href={`/videos/${video._id}`}>
                    <h4>{video.title}</h4>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

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
            프로필 수정하기
          </button>
        </div>
      </form>
    </div>
  );
}

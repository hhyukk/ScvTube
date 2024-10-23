import User from '../models/User';
import bcrypt from 'bcrypt';

const rootPage = 'http://localhost:3000/';

export const postJoin = async (req, res) => {
  const { name, username, email, password, location } = req.body;
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.status(200).json({ message: 'Join successful' }); // JSON 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: 'An account with this username does not exists.' });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).json({ error: 'Wrong password' });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.status(200).json({ message: 'Log User In!' });
};

export const getSession = async (req, res) => {
  if (req.session.loggedIn) {
    return res.status(200).json({ loggedIn: true, user: req.session.user });
  }
  return res.status(200).json({ loggedIn: false });
};

export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false, //새로운 가입 허용 안함
    scope: `read:user user:email`,
  };
  // URL에 쓰기 적합한 형태의 쿼리 문자열을 반환
  const optionUrl = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${optionUrl}`;

  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const optionUrl = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${optionUrl}`;

  const accessToken = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();

  if ('access_token' in accessToken) {
    const { access_token } = accessToken;
    const apiUrl = 'https://api.github.com/user';

    const userData = await (
      await fetch(`${apiUrl}`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
    if (!emailObj) {
      return res.redirect(`${rootPage}/login`);
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (!existingUser) {
      // 기존 사용자가 없으면 새 사용자 생성
      const user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: '',
        githubId: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = existingUser;
    return res.redirect(`${rootPage}`);
  } else {
    return res.redirect(`${rootPage}/login`);
  }
};

export const startKakaoLogin = (req, res) => {
  const baseUrl = 'https://kauth.kakao.com/oauth/authorize';
  const config = {
    client_id: process.env.KO_CLIENT,
    redirect_uri: process.env.KO_REDIRECT_URL,
    response_type: 'code',
    scope: 'profile_nickname',
  };
  const optionUrl = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${optionUrl}`;
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = 'https://kauth.kakao.com/oauth/token';
  const config = {
    grant_type: 'authorization_code',
    client_id: process.env.KO_CLIENT,
    redirect_uri: process.env.KO_REDIRECT_URL,
    code: req.query.code,
  };
  const optionUrl = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${optionUrl}`;

  const accessToken = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })
  ).json();

  const userData = await (
    await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
    })
  ).json();

  const userInfo = userData.kakao_account;
  console.log(userInfo);
  const nickname = userInfo.profile.nickname;
  console.log(nickname);

  if (!nickname) {
    return res.redirect(`${rootPage}/login`);
  }

  let username = await User.findOne({ username: nickname });

  if (!username) {
    const user = await User.create({
      name: nickname,
      avatarUrl: userInfo.profile.profile_image_url,
      username: nickname,
      email: 'aaa@aaa',
      password: '',
      githubId: false,
      kakaoId: true,
      location: '',
    });
  }
  req.session.loggedIn = true;
  req.session.user = username;
  return res.redirect(`${rootPage}`);
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 제거 중 오류:', err);
      return res.status(500).json({ error: '서버 오류' });
    }
    // 로그아웃 후 클라이언트에게 성공 응답
    return res.status(200).json({ message: '로그아웃 성공' });
  });
};

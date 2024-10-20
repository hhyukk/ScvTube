import User from '../models/User';
import bcrypt from 'bcrypt';

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
      return res.redirect('http://localhost:3000/login');
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect('http://localhost:3000');
    } else {
      // 기존 사용자가 없으면 새 사용자 생성
      const user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: '',
        githubId: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect('http://localhost:3000');
    }
  } else {
    return res.redirect('http://localhost:3000/login');
  }
};

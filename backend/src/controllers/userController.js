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

import User from '../models/User';
import Video from '../models/Video';

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

export const getSearch = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    });
    console.log(videos);
    return res.status(200).json(videos); // JSON 응답
  } else {
    return res.status(404).json({ error: 'Search failed' }); // JSON 응답
  }
};

export const postDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Delete successful' }); // JSON 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  try {
    const video = await Video.exists({ _id: id });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' }); // JSON 응답
    }
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags,
    });
    console.log(hashtags);
    return res.status(200).json({ message: 'Edit successful' }); // JSON 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.status(200).json({ message: 'Upload successful' }); // JSON 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: 'desc' });
    return res.status(200).json(videos); // JSON 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

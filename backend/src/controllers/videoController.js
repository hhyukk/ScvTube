import Video from '../models/Video';
import User from '../models/User';

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate('owner');
  console.log('video: ', video);
  if (!video) {
    return res.status(404).json({ error: 'not find Video' });
  }
  return res.status(200).json(video);
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
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.status(200).json({ message: 'Edit successful' }); // JSON 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
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

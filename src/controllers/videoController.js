import Video from '../models/Video';

export const getSearch = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        //query의 keyword 값을 대소문자 구분없이 검색
        $regex: new RegExp(keyword, 'i'),
      },
    });
    console.log(videos);
    return res.status(200).json(videos);
  } else {
    return res.status(404).send('Search Fail');
  }
};
export const postDelete = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.status(200).send('Delete successful');
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;

  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).send('not Exist Video');
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    // hashtags: Video.formatHashtags(hashtags),
    hashtags,
  });
  console.log(hashtags);

  return res.status(200).send('Edit successful');
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.status(200).send('Upload successful');
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
};
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: 'desc' });
  return res.status(200).json(videos);
};

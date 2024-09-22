import Video from '../models/Video';

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
    return res.status(404).render('upload', { pageTitle: 'Upload Video', errorMessage: error._message });
  }
};

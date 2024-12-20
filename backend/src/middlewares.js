import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = 'Wetube';
  res.locals.loggedInUser = req.session.user;
  console.log('Session값: ', req.session.user);
  next();
};

export const avatarUpload = multer({
  dest: 'uploads/avatars/',
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: 'uploads/videos/',
  limits: {
    fileSize: 10000000,
  },
});

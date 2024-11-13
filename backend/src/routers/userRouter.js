import express from 'express';
import {
  finishGithubLogin,
  finishKakaoLogin,
  getSee,
  logout,
  postChangePassword,
  postEdit,
  startGithubLogin,
  startKakaoLogin,
} from '../controllers/userController';
import { avatarUpload } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/:id', getSee);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/kakao/start', startKakaoLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get('/kakao/finish', finishKakaoLogin);
userRouter.post('/logout', logout);
userRouter.post('/edit', avatarUpload.single('avatar'), postEdit);
userRouter.post('/change-password', postChangePassword);

export default userRouter;

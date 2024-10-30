import express from 'express';
import {
  finishGithubLogin,
  finishKakaoLogin,
  logout,
  postChangePassword,
  postEdit,
  startGithubLogin,
  startKakaoLogin,
} from '../controllers/userController';
import { uploadFiles } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/github/start', startGithubLogin);
userRouter.get('/kakao/start', startKakaoLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get('/kakao/finish', finishKakaoLogin);
userRouter.post('/logout', logout);
userRouter.post('/edit', uploadFiles.single('avatar'), postEdit);
userRouter.post('/change-password', postChangePassword);

export default userRouter;

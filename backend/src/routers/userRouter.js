import express from 'express';
import {
  finishGithubLogin,
  finishKakaoLogin,
  logout,
  startGithubLogin,
  startKakaoLogin,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/github/start', startGithubLogin);
userRouter.get('/kakao/start', startKakaoLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get('/kakao/finish', finishKakaoLogin);
userRouter.post('/logout', logout);

export default userRouter;

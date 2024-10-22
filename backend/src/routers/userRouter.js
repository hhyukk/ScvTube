import express from 'express';
import { finishGithubLogin, finishKakaoLogin, startGithubLogin, startKakaoLogin } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/github/start', startGithubLogin);
userRouter.get('/kakao/start', startKakaoLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get('/kakao/finish', finishKakaoLogin);

export default userRouter;

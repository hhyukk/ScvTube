import express from 'express';
import { getSearch, home } from '../controllers/videoController';
import { postJoin, postLogin } from '../controllers/userController';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.get('/search', getSearch);
rootRouter.post('/join', postJoin);
rootRouter.post('/login', postLogin);

export default rootRouter;

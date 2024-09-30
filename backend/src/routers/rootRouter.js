import express from 'express';
import { getSearch, home, postJoin } from '../controllers/videoController';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.get('/search', getSearch);
rootRouter.post('/join', postJoin);

export default rootRouter;

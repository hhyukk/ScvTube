import express from 'express';
import { getSearch, home } from '../controllers/videoController';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.get('/search', getSearch);

export default rootRouter;

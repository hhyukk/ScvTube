import express from 'express';
import { getSearch, home } from '../controllers/videoController';
import { postJoin, postLogin } from '../controllers/userController';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.get('/search', getSearch);
rootRouter.post('/join', postJoin);
rootRouter.post('/login', postLogin);
rootRouter.get('/session', (req, res) => {
  if (req.session.loggedIn) {
    return res.status(200).json({ loggedIn: true, user: req.session.user });
  }
  return res.status(200).json({ loggedIn: false });
});

export default rootRouter;

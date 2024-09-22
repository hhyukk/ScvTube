import express from 'express';
import { postUpload } from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.post('/upload', postUpload);

export default videoRouter;

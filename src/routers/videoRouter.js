import express from 'express';
import { postDelete, postEdit, postUpload } from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.post('/upload', postUpload);
videoRouter.post('/:id([0-9a-f]{24})/edit', postEdit);
videoRouter.post('/:id([0-9a-f]{24})/delete', postDelete);

export default videoRouter;

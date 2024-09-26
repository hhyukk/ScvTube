import express from 'express';
import './db.js';
import './models/Video';
import './models/User';
import videoRouter from './routers/videoRouter';
import rootRouter from './routers/rootRouter';

const PORT = 4000;

const app = express();

app.use(express.json()); // 추가: JSON 요청 본문 파싱

app.use('/', rootRouter);
app.use('/videos', videoRouter);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);

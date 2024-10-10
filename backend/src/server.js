import express from 'express';
import cors from 'cors';
import './db.js';
import './models/Video';
import './models/User';
import videoRouter from './routers/videoRouter';
import rootRouter from './routers/rootRouter';

const PORT = 4000;

const app = express();

// CORS 미들웨어 설정
app.use(
  cors({
    origin: 'http://localhost:3000', // Next.js가 실행 중인 도메인만 허용
    methods: 'GET,POST,PUT,DELETE', // 허용할 HTTP 메소드 설정
  })
);
app.use(express.json()); // 추가: JSON 요청 본문 파싱

app.use('/', rootRouter);
app.use('/videos', videoRouter);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);

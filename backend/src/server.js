import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import './db.js';
import './models/Video';
import './models/User';
import { localsMiddleware } from './middlewares';
import videoRouter from './routers/videoRouter';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';

const PORT = 4000;

const app = express();

// CORS 미들웨어 설정
app.use(
  cors({
    origin: 'http://localhost:3000', // Next.js가 실행 중인 도메인만 허용
    methods: 'GET,POST,PUT,DELETE', // 허용할 HTTP 메소드 설정
    credentials: true, // 세션 쿠키를 허용
  })
);
app.use(express.json()); // 추가: JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true, //변경 사항이 없어도 저장
    saveUninitialized: true, //세션 초기화 전에도 저장
    cookie: {
      maxAge: 180000, // 3분(180,000 밀리초)
      sameSite: 'lax', // 또는 'strict'로 설정
      secure: false, // 로컬 개발 환경에서 HTTPS가 아닌 경우 false
    },

    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/scvTube' }),
  })
);

app.use(localsMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);

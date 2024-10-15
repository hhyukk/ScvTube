import mongoose from 'mongoose';
mongoose.connect(process.env.DB_URL); //MongoDB 데이터베이스에 연결
const db = mongoose.connection; //DB 연결 상태 추적
const handleOpen = () => console.log('✅ Connected to DB');
const handleError = (error) => console.log('DB Error', error);
db.on('error', handleError); //DB 연결 오류 발생시 handleError() 실행
db.once('open', handleOpen); //DB 연결 성공시 handleOpen() 실행

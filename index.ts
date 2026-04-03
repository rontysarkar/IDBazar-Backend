import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import connectDb from './config/dbConnect'
import authRoutes from './routes/authRouter'
import postRoutes from './routes/postRouter'

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

const corsOption={
    origin:process.env.FRONTEND_URL,
    credential:true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

connectDb();

// api endpoint
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})
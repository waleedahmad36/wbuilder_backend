import express from 'express'
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import { connectDB } from './config/db.js';
import cors from 'cors';
import portfolioRoutes from './routes/portfolioRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'


const app=express();


app.use(cors({
    origin: ['https://wbuilder-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true
  }));

const PORT=process.env.PORT || 5000;
app.use(express.json());   //will allow us to parse req.body
app.use(cookieParser());

app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/portfolio',portfolioRoutes);
app.use('/api/v1/feedback',feedbackRoutes);

app.get('/',(req,res)=>{
    res.send('API is running');
})

app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`);
    connectDB();
})
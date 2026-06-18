import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userrouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import studioRouter from './routes/studioRoutes.js';
import creationRouter from './routes/creationRoutes.js';
import collectionRouter from './routes/collectionRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const PORT=process.env.PORT|| 4000
const app=express()
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://imagify-lac.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json())
await connectDB()
app.use('/api/user',userrouter)
app.use('/api/image',imageRouter)
app.use('/api/studio',studioRouter)
app.use('/api/creations',creationRouter)
app.use('/api/collections',collectionRouter)
app.use('/api/payment',paymentRouter)
app.get('/',(req,res)=> res.send("API Working"))
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
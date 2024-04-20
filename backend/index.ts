import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/DB';
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes'

dotenv.config()
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/users', userRoutes)

const port = 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

app.get('/health', async (req: Request, res: Response) => {
    res.send({ message: 'health OK' })
});

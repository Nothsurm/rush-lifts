import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/DB';
import cookieParser from 'cookie-parser'

dotenv.config()
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const port = 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

app.get('/health', async (req: Request, res: Response) => {
    res.send({ message: 'health OK' })
});

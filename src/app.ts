import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import aiRoutes from './routes/ai';
import postRoutes from './routes/post';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/public', authRoutes, userRoutes, aiRoutes, postRoutes);

export default app;

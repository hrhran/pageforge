import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import aiRoutes from './routes/ai';
import postRoutes from './routes/post';
import blogSettingsRoutes from './routes/blogSettings'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/blog', express.static('build/blog'));

app.use('/api/v1/public', authRoutes, userRoutes, aiRoutes, postRoutes, blogSettingsRoutes);

export default app;

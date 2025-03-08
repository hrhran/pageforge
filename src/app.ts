import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// import authRoutes from './routes/auth';
// import userRoutes from './routes/user';
// import aiRoutes from './routes/ai';
// import postRoutes from './routes/post';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/login', authRoutes);
// app.use('/user', userRoutes);
// app.use('/ai', aiRoutes);
// app.use('/post', postRoutes);

export default app;

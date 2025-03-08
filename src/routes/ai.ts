import express from 'express';
import { generatePost } from '../controllers/aiController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/generate-post', authenticateJWT, generatePost);

export default router;

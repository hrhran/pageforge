import express from 'express';
import { createPost, listPosts, updatePost, deletePost } from '../controllers/postController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-post', authenticateJWT, createPost);
router.get('/', authenticateJWT, listPosts);
router.put('/:id', authenticateJWT, updatePost);
router.delete('/:id', authenticateJWT, deletePost);

export default router;

import express from 'express';
import { getBlogSettings, updateBlogSettings } from '../controllers/blogSettingsController';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/blog-settings', authenticateJWT, getBlogSettings);
router.put('/blog-settings', authenticateJWT, authorizeRole(['superadmin']), updateBlogSettings);

export default router;

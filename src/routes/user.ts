import express from 'express';
import { addUser, listUsers, deleteUser, editUser, updateProfile } from '../controllers/userController';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/add-user', authenticateJWT, authorizeRole(['superadmin']), addUser);
router.get('/list-users', authenticateJWT, authorizeRole(['superadmin']), listUsers);
router.delete('/delete-user/:id', authenticateJWT, authorizeRole(['superadmin']), deleteUser);
router.put('/edit-user/:id', authenticateJWT, authorizeRole(['superadmin']), editUser);

router.put('/profile', authenticateJWT, updateProfile);

export default router;

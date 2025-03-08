import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware';

export const addUser = async (req: Request, res: Response) => {
  const { username, password, displayName, aiEnabled, aiModel, aiApiKey, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      displayName,
      aiEnabled: aiEnabled || false,
      aiModel: aiModel || null,
      aiApiKey: aiApiKey || null,
      role: role || 'user'
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, aiEnabled } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return ;
    }
    user.role = role || user.role;
    user.aiEnabled = aiEnabled !== undefined ? aiEnabled : user.aiEnabled;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user.id;
  const { password, displayName, aiModel, aiApiKey } = req.body;
  
  try {
    const user = await User.findByPk(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (displayName) {
      user.displayName = displayName;
    }
    if (aiModel) {
      user.aiModel = aiModel;
    }
    if (aiApiKey) {
      user.aiApiKey = aiApiKey;
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

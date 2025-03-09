import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const signup = async (req: Request, res: Response) => {
  const { username, password, displayName } = req.body;
  try {
    const userCount = await User.count();
    let role : 'superadmin' | 'user' = 'user';
    let status: 'approved' | 'pending' = 'pending';
    if (userCount === 0) {
      role = 'superadmin';
      status = 'approved';
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      displayName: displayName || '',
      role,
      aiEnabled: false,
      status
    });
    if (status === 'pending') {
      res.json({ message: 'Registration successful, pending approval', user: newUser });
      return;
    }
    const token = generateToken({ id: newUser.id, username: newUser.username, role: newUser.role });
    res.json({ token, user: newUser });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    if (user.status === 'pending') {
      res.status(403).json({ message: 'Your account is pending approval' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    res.json({ token, user });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    return;
  }
};

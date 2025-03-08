import { Request, Response } from 'express';
import axios from 'axios';
import { User } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const generatePost = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { title } = req.body;
  
  try {
    const user = await User.findByPk(userId);
    if (!user || !user.aiEnabled || !user.aiApiKey || !user.aiModel) {
      res.status(403).json({ message: 'AI generation not enabled for this user' });
      return;
    }
    
    const prompt = `Generate a blog post titled - ${title} - with rich html text, heading and side heading - Just straight content with heading, dont write anything else`;
    
    let modelEndpoint = '';
    if (user.aiModel.toLowerCase().includes('gemini-2.0')) {
      modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${user.aiApiKey}`;
    } else {
        res.status(400).json({ message: 'Unsupported AI model' });
        return;
    }
    
    const response = await axios.post(modelEndpoint, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const aiContent = response.data;
    res.json(aiContent);
  } catch (error) {
    console.error("Error generating post:", error);
    res.status(500).json({ message: 'Error generating post', error });
  }
};

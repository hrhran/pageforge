import { Request, Response } from 'express';
import axios from 'axios';
import { User } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';
import { decode } from 'he';

const decodeGeminiOutput =(rawText: string): string => decode(rawText);

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
    
    const candidate = response.data.candidates && response.data.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      res.status(500).json({ message: 'Invalid response from AI service' });
      return;
    }
    const rawText = candidate.content.parts[0].text;
    const decodedContent = decodeGeminiOutput(rawText);
    
    res.json({ content: decodedContent });
    return;
  } catch (error) {
    console.error("Error generating post:", error);
    res.status(500).json({ message: 'Error generating post', error });
    return;
  }
};

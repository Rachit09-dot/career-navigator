import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
}

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: "You are the friendly and helpful AI Career Assistant for the CareerNavigator website. Your goal is to guide students in India towards the right career paths, help them understand features like Career DNA and Skill Gap analysis on the platform, and answer any career-related questions they might have. Keep your answers concise, encouraging, and highly relevant."
    });

    // Format history for Gemini - ensure it starts with a user message
    const previousMessages = messages.slice(0, -1);
    const firstUserIndex = previousMessages.findIndex((msg: any) => msg.role === 'user');
    
    let chatHistory: any[] = [];
    if (firstUserIndex !== -1) {
      chatHistory = previousMessages.slice(firstUserIndex).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
    }

    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ message: 'Failed to process chat' });
  }
});

export default router;

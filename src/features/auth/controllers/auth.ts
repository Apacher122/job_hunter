import { Request, Response } from 'express';

import { AuthSchema } from '../models/auth';
import { loginOrRegister } from '../services/auth';
import {z} from 'zod';

export const loginController = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = AuthSchema.parse(req.body);
    const user = await loginOrRegister(parsed);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


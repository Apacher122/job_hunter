import express from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { publicKey } from '../server/initializeApp';

const sseClients: express.Response[] = [];

export const publicKeyStreamRouter = express.Router();

publicKeyStreamRouter.get('/', authenticate, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ key: publicKey })}\n\n`);
  sseClients.push(res);

  req.on('close', () => {
    const index = sseClients.indexOf(res);
    if (index !== -1) sseClients.splice(index, 1);
  });
});

export const getPublicKey = (req: express.Request, res: express.Response) => {
  res.json({ key: publicKey });
};

export const broadcastPublicKey = () => {
  const payload = `data: ${JSON.stringify({ key: publicKey })}\n\n`;
  sseClients.forEach((client) => client.write(payload));
};

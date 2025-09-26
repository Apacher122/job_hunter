import { NextFunction, Request, Response } from 'express';

import { decryptWithPrivateKey } from '../../security/asymmetric';

interface DecryptApiKeyRequest extends Request {
  body: {
    encryptedKey?: string;
    apiKey?: string;
    [key: string]: any;
  };
}

export const decryptApiKeyMiddleware = (privateKey: string) => {
  return (req: DecryptApiKeyRequest, res: Response, next: NextFunction) => {
    const encryptedKey = req.body?.encryptedKey;
    if (!encryptedKey) {
      res.status(400).send('Missing encrypted key');
      return;
    }

    try {
      req.body.apiKey = decryptWithPrivateKey(privateKey, encryptedKey);
      next();
    } catch (err) {
      console.error('Failed to decrypt key', err);
      res.status(400).send('Failed to decrypt key');
    }
  };
};

import { NextFunction, Request, Response } from 'express';

import { decryptWithPrivateKey } from '../../security/asymmetric';

export interface DecryptApiKeyRequest extends Request {
  body: {
    encryptedKey?: string;
    apiKey?: string;
    [key: string]: any;
  };
}

export const decryptApiKeyMiddleware = (privateKey: string) => {
  return (req: DecryptApiKeyRequest, res: Response, next: NextFunction) => {
    const header = req.headers["x-encrypted-api-key"];
    if (!header || Array.isArray(header)) {
      res.status(400).send("Missing or invalid encrypted key");
      return;
    }
    console.log("Decrypting key", header);

    try {
      req.body.apiKey = decryptWithPrivateKey(privateKey, header);
      next();
    } catch (err) {
      console.error("Failed to decrypt key", err);
      res.status(400).send("Failed to decrypt key");
    }
  };
};

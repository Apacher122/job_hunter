import crypto from 'crypto';

export const generateKeyPair = () => {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
};

export const encryptWithPublicKey = (publicKey: string, data: string) => {
  return crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(data)
  ).toString('base64');
};

export const decryptWithPrivateKey = (privateKey: string, encrypted: string) => {
  return crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(encrypted, 'base64')
  ).toString('utf-8');
};

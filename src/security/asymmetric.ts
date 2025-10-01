import * as crypto from 'crypto';

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
  try {
    const binary = atob(encrypted);
    const buf = Buffer.alloc(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buf[i] = binary.charCodeAt(i);
    }

    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      buf
    );

    return decrypted.toString("utf-8");
  } catch (err) {
    console.error("Failed to decrypt raw RSA-OAEP key", err);
    throw err;
  }
};

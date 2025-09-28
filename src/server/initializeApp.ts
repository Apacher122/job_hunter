import { generateKeyPair } from '../security/asymmetric';
import { broadcastPublicKey } from '../security/publicKeySSE';

export let publicKey: string;
export let privateKey: string;

export const initializeApp = async () => {
  try {
    const keypair = generateKeyPair();
    publicKey = keypair.publicKey;
    privateKey = keypair.privateKey;
    console.log('Key pair generated');
    broadcastPublicKey();
  } catch (error: unknown) {
    console.error('Error initializing app:', error instanceof Error ? error.message : error);
    throw error;
  }
};

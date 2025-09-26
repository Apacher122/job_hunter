import { firebase } from 'googleapis/build/src/apis/firebase';
import {z} from 'zod';

export const AuthSchema = z.object({
  firebaseUid: z.string(),
})

export type AuthType = z.infer<typeof AuthSchema>;
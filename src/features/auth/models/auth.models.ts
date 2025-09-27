import {z} from 'zod';

export const AuthSchema = z.object({
  firebase_uid: z.string(),
})

export type AuthType = z.infer<typeof AuthSchema>;
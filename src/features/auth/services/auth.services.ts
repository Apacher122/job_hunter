import { createUser, getUserById } from "../../../database";

import { AuthType } from "../models/auth.models";

export const loginOrRegister = async (auth: AuthType) => {
  const existingUser = await getUserById(auth.firebaseUid);
  if (existingUser) return existingUser;
  return await createUser(auth);
};
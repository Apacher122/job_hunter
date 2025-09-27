import * as db from "../../../database";

import { AuthType } from "../models/auth.models";

export const loginOrRegister = async (auth: AuthType) => {
  const existingUser = await db.getUserById(auth.firebase_uid);
  if (existingUser) return existingUser;
  return await db.createUser(auth);
};

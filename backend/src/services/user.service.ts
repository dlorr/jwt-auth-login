import { NOT_FOUND } from "../constants/http-status";
import UserModel from "../models/user.model";
import appAssert from "../utils/app-assert";

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found.");
  return user.omitPassword();
};

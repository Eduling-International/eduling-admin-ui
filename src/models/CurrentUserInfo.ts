import { RoleEnum } from "@/enum";

export interface CurrentUserInfo {
  id: string;
  username: string;
  email: string;
  name: string;
  active: boolean;
  archived: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastChangePassword: Date;
  bgColor: string;
  role: UserInfoRole;
  createdUser: UserInfoCreatedUser;
}

export interface UserInfoRole {
  id: string;
  name: RoleEnum;
  description: string;
}

export interface UserInfoCreatedUser {
  id: string;
  username: string;
  bgColor: string;
}

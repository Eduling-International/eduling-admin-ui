export interface CurrentUserInfo {
  id: string;
  username: string;
  email: string;
  name: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastChangePassword: Date;
  role: UserInfoRole;
  createdUser: UserInfoCreatedUser;
}

export interface UserInfoRole {
  id: string;
  name: string;
  description: string;
}

export interface UserInfoCreatedUser {
  id: string;
  username: string;
}

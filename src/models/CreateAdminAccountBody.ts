import { RoleEnum } from '@/enum';

export default interface CreateAdminAccountBody {
  username: string;
  password: string;
  name: string;
  email: string;
  role: RoleEnum.CREATOR | RoleEnum.VIEWER;
}

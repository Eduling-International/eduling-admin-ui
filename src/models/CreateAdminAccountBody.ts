import { RoleEnum } from '@/enum';

export default interface CreateAdminAccountBody {
  username: string;
  password: string;
  name: string;
  role: RoleEnum;
}

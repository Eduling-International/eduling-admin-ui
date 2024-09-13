import {
  CreateAdminAccountBody,
  CurrentUserInfo,
  SearchAdminUserParam,
  UpdateResponse,
} from '@/models';
import APIBaseService from './APIBaseService';

export default class AdminUserService extends APIBaseService {
  private readonly PREFIX: string = '/admin-users';

  constructor() {
    super();
  }

  public search = (params: SearchAdminUserParam) => {
    return this.get<CurrentUserInfo[], SearchAdminUserParam>(
      `${this.PREFIX}/search`,
      params,
    );
  };

  public archive = (userId: string) => {
    return this.patch<UpdateResponse>(`${this.PREFIX}/${userId}/archive`);
  };

  public unArchive = (userId: string) => {
    return this.patch<UpdateResponse>(`${this.PREFIX}/${userId}/un-archive`);
  };

  public _delete = (userId: string) => {
    return this.delete<UpdateResponse>(`${this.PREFIX}/${userId}`);
  };

  public create = (data: CreateAdminAccountBody) => {
    return this.post(`${this.PREFIX}/new`, data);
  };
}

import {
  CreateAdminAccountBody,
  SearchAdminUserParam,
  SearchAdminUserResponse,
  UpdateResponse,
  RequirePasswordBody,
} from '@/models';
import APIBaseService from './APIBaseService';

export default class AdminUserService extends APIBaseService {
  private readonly PREFIX: string = '/admin-users';

  constructor() {
    super();
  }

  public search = (params: SearchAdminUserParam) => {
    return this.get<SearchAdminUserResponse, SearchAdminUserParam>(
      `${this.PREFIX}/search`,
      params,
    );
  };

  public archive = (userId: string) => {
    return this.patch<UpdateResponse>(`${this.PREFIX}/${userId}/archive`);
  };

  public unArchive = (userId: string) => {
    return this.patch<UpdateResponse>(`${this.PREFIX}/${userId}/un_archive`);
  };

  public _delete = (userId: string, body: RequirePasswordBody) => {
    return this.delete<UpdateResponse>(`${this.PREFIX}/${userId}`, body);
  };

  public create = (data: CreateAdminAccountBody) => {
    return this.post<{userId: string}>(`${this.PREFIX}/new`, data);
  };
}

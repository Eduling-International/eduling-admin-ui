import {
  ChangePasswordBody,
  CurrentUserInfo,
  LoginBody,
  LoginResponse,
} from '@/models';
import APIBaseService from './APIBaseService';
import APIEndpoint from './Endpoint';

class AuthenticationService extends APIBaseService {
  constructor() {
    super();
  }

  public async login(credentials: LoginBody) {
    return this.post<LoginResponse>(
      APIEndpoint.Authentication.LOGIN,
      credentials,
    );
  }

  public getCurrentUser = () => {
    return this.get<CurrentUserInfo>(
      APIEndpoint.Authentication.CURRENT_USER_INFO,
    );
  };

  public changePassword = (data: ChangePasswordBody) => {
    return this.put<string>(APIEndpoint.Authentication.CHANGE_PASSWORD, data);
  };
}

export default AuthenticationService;

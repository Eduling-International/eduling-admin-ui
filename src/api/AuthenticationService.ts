import { LoginBody, LoginResponse } from '@/models';
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

  public async getCurrentUser() {
    // Implement here
  }
}

export default AuthenticationService;

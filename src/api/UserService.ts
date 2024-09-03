import { CountResponse } from '@/models';
import APIBaseService from './APIBaseService';

export default class UserService extends APIBaseService {
  private readonly PREFIX: string = '/users';

  constructor() {
    super();
  }

  public count() {
    return this.get<CountResponse>(this.PREFIX + '/count');
  }
}

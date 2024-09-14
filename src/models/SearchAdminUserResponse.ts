import { CurrentUserInfo } from './CurrentUserInfo';
import Pagination from './Pagination';

export default interface SearchAdminUserResponse {
  users: CurrentUserInfo[];
  pagination: Pagination;
}

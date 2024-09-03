import Pagination from './Pagination';
import Task from './Task';

export default interface SearchTaskResponse {
  tasks: Task[];
  pagination: Pagination;
}

import {
  Category,
  CountResponse,
  CreateCategoryBody,
  SearchCategoryParams,
  SearchCourseParams,
} from '@/models';
import APIBaseService from './APIBaseService';

export default class CategoryService extends APIBaseService {
  private readonly PREFIX: string = '/categories';

  constructor() {
    super();
  }

  public async count() {
    return this.get<CountResponse>(this.PREFIX + '/count');
  }

  public search = (params?: SearchCategoryParams) => {
    return this.get<Category[], SearchCourseParams>(
      this.PREFIX + '/search',
      params,
    );
  };

  public create = (data: CreateCategoryBody) => {
    return this.post<{ categoryId: string }, CreateCategoryBody>(
      this.PREFIX + '/create',
      data,
    );
  };
}

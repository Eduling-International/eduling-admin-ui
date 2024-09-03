import { CountResponse, SearchTaskParams, SearchTaskResponse } from '@/models';
import APIBaseService from './APIBaseService';

export default class TaskService extends APIBaseService {
  private readonly PREFIX: string = '/tasks';

  constructor() {
    super();
  }

  public count() {
    return this.get<CountResponse>(this.PREFIX + '/count');
  }

  public search(params: SearchTaskParams) {
    return this.get<SearchTaskResponse>(this.PREFIX + '/search', {
      ...params,
      categoryId: params?.categoryId?.trim(),
    });
  }
}

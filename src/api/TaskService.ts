import {
  CountResponse,
  ImportTaskBody,
  SearchTaskParams,
  SearchTaskResponse,
} from '@/models';
import APIBaseService from './APIBaseService';

export default class TaskService extends APIBaseService {
  private readonly PREFIX: string = '/tasks';

  constructor() {
    super();
  }

  public count() {
    return this.get<CountResponse>(this.PREFIX + '/count');
  }

  public search = (params: SearchTaskParams) => {
    return this.get<SearchTaskResponse, SearchTaskParams>(
      this.PREFIX + '/search',
      {
        ...params,
        categoryId: params?.categoryId?.trim(),
      },
    );
  };

  public import = (data: ImportTaskBody) => {
    data.range = data.range ? '!' + data.range : null;
    return this.post<{ status: number; message: string }>(
      this.PREFIX + '/import',
      data,
    );
  };
}

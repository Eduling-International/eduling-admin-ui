import {
  CountResponse,
  Course,
  CourseDetailsResponse,
  CreateCourseBody,
  CreateCourseResponse,
  RequirePasswordBody,
  SearchCourseParams,
  UpdateCourseBody,
  UpdateResponse,
} from '@/models';
import APIBaseService from './APIBaseService';

export default class CourseService extends APIBaseService {
  private readonly PREFIX: string = '/courses';

  constructor() {
    super();
  }

  public async count() {
    return this.get<CountResponse>(this.PREFIX + '/count');
  }

  public search = (params?: SearchCourseParams) => {
    return this.get<Course[], SearchCourseParams>(
      this.PREFIX + '/search',
      params,
    );
  };

  public rearrange = (courseId: string, displayOrder: number) => {
    return this.put<UpdateResponse>(
      `${this.PREFIX}/${courseId}/${displayOrder}/rearrange`,
    );
  };

  public create = (data: CreateCourseBody) => {
    return this.post<CreateCourseResponse>(`${this.PREFIX}/create`, data);
  };

  public getDetails = (courseId: string) => {
    return this.get<CourseDetailsResponse>(
      `${this.PREFIX}/${courseId}/details`,
    );
  };

  public update = (courseId: string, data: UpdateCourseBody) => {
    return this.put<UpdateResponse>(`${this.PREFIX}/${courseId}/update`, data);
  };

  public updateStatus = (courseId: string, visible: boolean) => {
    return this.put<UpdateResponse>(
      `${this.PREFIX}/${courseId}/update-status/${visible}`,
    );
  };

  public deleteCourse = (courseId: string, body: RequirePasswordBody) => {
    return this.delete<UpdateResponse, RequirePasswordBody>(
      `${this.PREFIX}/${courseId}/delete`,
      body,
    );
  };

  public rearrangeAllTasks = (courseId: string) => {
    return this.put<{
      message: string;
    }>(`${this.PREFIX}/${courseId}/rearrange-all`);
  };
}

import {
  CountResponse,
  Course,
  CourseDetailsResponse,
  CreateCourseBody,
  CreateCourseResponse,
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

  public async search(params?: SearchCourseParams) {
    return this.get<Course[], SearchCourseParams>(
      this.PREFIX + '/search',
      params,
    );
  }

  public async rearrange(courseId: string, displayOrder: number) {
    return this.put<UpdateResponse>(
      `${this.PREFIX}/${courseId}/${displayOrder}/rearrange`,
    );
  }

  public create(data: CreateCourseBody) {
    return this.post<CreateCourseResponse>(`${this.PREFIX}/create`, data);
  }

  public getDetails(courseId: string) {
    return this.get<CourseDetailsResponse>(
      `${this.PREFIX}/${courseId}/details`,
    );
  }

  public update(courseId: string, data: UpdateCourseBody) {
    return this.put<UpdateResponse>(`${this.PREFIX}/${courseId}/update`, data);
  }
}

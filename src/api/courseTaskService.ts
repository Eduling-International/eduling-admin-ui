import { AddTaskToCourseBody, UpdateResponse } from '@/models';
import APIBaseService from './APIBaseService';

export default class CourseTaskService extends APIBaseService {
  private readonly PREFIX: string = '/courses';

  private readonly courseId: string;

  constructor(courseId: string) {
    super();
    this.courseId = courseId;
  }

  public addTask(data: AddTaskToCourseBody) {
    return this.post<UpdateResponse>(
      `${this.PREFIX}/${this.courseId}/tasks/add`,
      data,
    );
  }

  public lockTask(taskKey: string, locked: boolean) {

  }

  public removeTask(taskKey: string) {
    return this.delete<UpdateResponse>(
      `${this.PREFIX}/${this.courseId}/tasks/${taskKey}/delete`,
    );
  }
}

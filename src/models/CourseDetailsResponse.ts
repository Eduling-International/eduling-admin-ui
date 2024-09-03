import Course from './Course';
import Task from './Task';

export default interface CourseDetailsResponse extends Course {
  tasks: Task[];
}

export default interface CreateCourseBody {
  name: string;
  description?: string | null;
  levels: string[];
  coverPicture: string;
  visible: boolean;
  tasks?:
    | {
        key: string;
        locked: boolean;
      }[]
    | null;
}

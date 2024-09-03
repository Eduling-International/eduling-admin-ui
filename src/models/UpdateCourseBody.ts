export default interface UpdateCourseBody {
  name: string;
  description?: string | null;
  levels: string[];
  coverPicture: string;
  visible: boolean;
}

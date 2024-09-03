export default interface Course {
  id: string;
  name: string;
  description: string;
  level: string;
  status: 0 | 1;
  coverPicture: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

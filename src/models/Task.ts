import Category from './Category';

export default interface Task {
  id: string;
  key: string;
  name: string;
  level: number;
  active: boolean;
  minAge: number;
  maxAge: number;
  coverPicture: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  categoryId: string;
  hint: string;
  freePublication: boolean;
  numberOfPlays: number;
  category: Category;
  locked?: boolean;
}

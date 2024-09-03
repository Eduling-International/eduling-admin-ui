export default interface Category {
  id: string;
  key: string;
  name: string;
  active: boolean;
  mode: 'AI_DUO' | 'SOLO' | 'NORMAL';
  order: number;
  createdDate: string;
  updatedDate: string;
}

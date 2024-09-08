export default interface ImportTaskBody {
  name: string;
  range?: string | null;
  excludeHeader: boolean;
}

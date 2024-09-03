export default interface ExchangeResponse<R> {
  requestId: string;
  status: number;
  data: R | null;
  isError: boolean;
  message: string | null;
}

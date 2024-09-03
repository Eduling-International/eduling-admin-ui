type APIBaseResponse<T> = {
  requestId: string;
  data: T;
};

export default APIBaseResponse;

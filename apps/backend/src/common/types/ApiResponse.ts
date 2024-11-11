export type ApiResponse<T> = {
  statusCode: number;
  errorCode: string;
  errorMessage: string;
  data: T;
};

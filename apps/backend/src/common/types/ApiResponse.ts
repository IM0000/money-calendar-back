export type ApiResponse<T> = {
  statusCode: number;
  errorCode: string | null;
  errorMessage: string | null;
  data: T | null;
};

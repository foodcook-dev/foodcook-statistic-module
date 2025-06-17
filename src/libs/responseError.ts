export type ApiErrorResponse = {
  code: number;
  status: number;
  message: string;
  error: string;
};

class ResponseError {
  // readonly code: ApiErrorResponse['code'];
  // readonly status: ApiErrorResponse['status'];
  // readonly message: ApiErrorResponse['message'];
  // readonly defaultText: string;
  readonly error: ApiErrorResponse['error'];

  constructor(response: any) {
    const { error } = response;
    // this.code = code;
    // this.status = status;
    // this.message = message;
    // this.defaultText = `Error Code ${code}: ${message}`;
    this.error = error;
  }
}

export default ResponseError;

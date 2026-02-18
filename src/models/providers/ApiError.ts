export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
  ) {
    let message = `API Error: ${status} ${statusText}`;

    if (status === 504) {
      message =
        'Server is not responding in time. Check if the backend server is running and available';
    } else if (status === 503) {
      message = 'Service is temporarily unavailable. Please try again later.';
    } else if (status === 502) {
      message = 'Gateway error. The backend server is not responding.';
    } else if (status === 500) {
      message =
        'Internal server error. The backend server encountered an error. Please check if the backend server is running and accessible.';
    } else if (data) {
      if (typeof data === 'string') {
        if (data.trim().startsWith('<html>') || data.trim().startsWith('<!DOCTYPE')) {
          const titleMatch = data.match(/<title>(.*?)<\/title>/i);
          if (titleMatch) {
            message = titleMatch[1];
          } else {
            message =
              status === 504
                ? 'Server is not responding in time. Check if the backend server is running.'
                : `API Error: ${status} ${statusText}`;
          }
        } else {
          message = data;
        }
      } else if (data.message) {
        message = data.message;
      } else if (data.detail) {
        message = data.detail;
      } else if (data.error) {
        message = data.error;
      } else {
        try {
          message = JSON.stringify(data);
        } catch {
          message = String(data);
        }
      }
    } else if (status === 422) {
      message = 'Unprocessable Entity. Please check the request body and try again.';
    }
    super(message);
    this.name = 'ApiError';
  }

  get message(): string {
    return super.message;
  }
}

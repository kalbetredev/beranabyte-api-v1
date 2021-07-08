import { Error } from "mongoose";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.status = status;
  }
}

export default ApiError;

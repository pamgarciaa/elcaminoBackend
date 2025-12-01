class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  // --- HELPER ESTÁTICO ---
  static try(object, message = "Resource not found", statusCode = 404) {
    if (!object) {
      throw new AppError(message, statusCode);
    }
    return object;
  }
}

export default AppError;

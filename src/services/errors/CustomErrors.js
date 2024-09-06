class CustomError {
  static createError({ name = "Error", cause, message, code = 1,shouldThrow }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    if (shouldThrow) {
      throw error;
    } else {
      return error;
    }}
}

module.exports = CustomError;

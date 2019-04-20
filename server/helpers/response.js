const response = {
  error(res, statusCode, message) {
    return res.status(statusCode).json({
      status: statusCode,
      error: message,
    });
  },

  success(res, statusCode, message, data) {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      data,
    });
  },
};

export default response;

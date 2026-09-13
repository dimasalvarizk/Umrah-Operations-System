/**
 * Success API Response Helper
 */
function successResponse(res, message = 'Success', data = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Error API Response Helper
 */
function errorResponse(res, message = 'An error occurred', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};

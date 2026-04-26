const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  if (!err.isOperational && statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(isProd ? {} : { stack: err.stack }),
  });
};

export default errorHandler;

const errorHandler = (err, req, res, next) => {
  console.log(err);
  res
    .status(err.statusCode || 500)
    .send(
      err.statusCode && err.message
        ? err.message
        : "Ops!!! Something went wrong!"
    );
};

module.exports = errorHandler;
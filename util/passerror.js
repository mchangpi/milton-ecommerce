const passError = (err, cb) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return cb(error);
};

module.exports = passError;

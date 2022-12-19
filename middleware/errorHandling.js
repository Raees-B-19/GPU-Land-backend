function errorHandling(err, req, res, next) {
  if (err) {
    res.status(400).json({
      msg: "Error has occurred. Please try again. render not working",
    });
  }
  next();
}

module.exports = {errorHandling};

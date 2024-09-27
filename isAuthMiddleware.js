const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.send("session expired login please.");
  }
};
module.exports = isAuth;

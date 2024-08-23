const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const {
      cookies: { access_token: token },
    } = req;

    if (!token) {
      throw new ErrorResponse("Forbidden!", 403);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    console.log(error);
    res.status(403).send("Forbidden!");
  }
};

module.exports = authenticate;

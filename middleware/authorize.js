const jwt = require("jsonwebtoken");
module.exports.SECRET_KEY = "secret key";

module.exports.authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;

  // Retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
  } else {
    res
      .status(403)
      .json({ error: true, message: "Authorization header not found" });
    return;
  }

  // Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, module.exports.SECRET_KEY);

    if (decoded.exp < Date.now()) {
      res.status(403).json({ error: true, message: "Token has expired" });
      return;
    }
    // Permit user to advance to route
    next();
  } catch (e) {
    res.status(403).json({ error: true, message: e.message });
  }
};
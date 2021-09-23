const authorize = (req, res, next) => {
  const { user } = req.query;
  if (user === "wypa") {
    req.user = { user: "wypa", id: 11 };
    next();
  } else {
    return res.status(401).send("Not authorized");
  }
};
module.exports = authorize;

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ success: false, message: `Access denied. Required: ${roles.join(" or ")}` });
  next();
};
module.exports = { authorizeRoles };

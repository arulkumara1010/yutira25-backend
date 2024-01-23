import User from "../models/User.js";

const authorize = async (token) => {
  try {
    const payload = await verfiyAccessToken(token);
    const email = payload.aud;
    const user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw err;
  }
};

export const authorized = async (req, res, next) => {
  try {
    const authorization = req.session;
    if (!authorization)
      return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const currentUser = await authorize(token);
    if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const isAdmin = async (req, res, next) => {
  if (!res.locals.user)
    return res.status(401).json({ message: "Unauthorized" });
  if (res.locals.user.role != "admin")
    return res.status(401).json({ message: "Unauthorized" });
  next();
};

import jwt from "jsonwebtoken";

const JWT_ISSUER = "http://localhost:5000";

const ACCESS_TOKEN_EXPIRES_IN = "1d";
const REFRESH_TOKEN_EXPIRES_IN = "1d";
const VERIFY_TOKEN_EXPIRES_IN = "1h";

const ACCESS_TOKEN_SECRET = "sdnjfknsjikjkfnkdnf";
const REFRESH_TOKEN_SECRET = "ertyuihkgjbvdmhkjnlsd";
const VERIFY_TOKEN_SECRET = "iouytretuhkjbnkmlm";

const ACCESS_TOKEN = "access-token";
const REFRESH_TOKEN = "refresh-token";
const VERIFY_TOKEN = "verify-token";

export const signAccessToken = async (email) => {
  return await signToken(email, ACCESS_TOKEN);
};

export const signRefreshToken = async (email) => {
  return await signToken(email, REFRESH_TOKEN);
};

export const signVerificationToken = async (email) => {
  return await signToken(email, VERIFY_TOKEN);
};

const signToken = (email, type) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn:
        type == ACCESS_TOKEN
          ? ACCESS_TOKEN_EXPIRES_IN
          : type == VERIFY_TOKEN
          ? VERIFY_TOKEN_EXPIRES_IN
          : REFRESH_TOKEN_EXPIRES_IN,
      issuer: JWT_ISSUER,
      audience: email,
    };

    const secret =
      type == ACCESS_TOKEN
        ? ACCESS_TOKEN_SECRET
        : type == VERIFY_TOKEN
        ? VERIFY_TOKEN_SECRET
        : REFRESH_TOKEN_SECRET;

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      if (token) resolve(token);
    });
  });
};

export const verfiyAccessToken = async (token) => {
  return await verifyToken(token, ACCESS_TOKEN);
};

export const verifyRefreshToken = async (token) => {
  return await verifyToken(token, REFRESH_TOKEN);
};

export const verifyVerificationToken = async (token) => {
  return await verifyToken(token, VERIFY_TOKEN);
};

const verifyToken = (token, type) => {
  return new Promise((resolve, reject) => {
    const secret =
      type == ACCESS_TOKEN
        ? ACCESS_TOKEN_SECRET
        : type == VERIFY_TOKEN
        ? VERIFY_TOKEN_SECRET
        : REFRESH_TOKEN_SECRET;

    jwt.verify(token, secret, (err, payload) => {
      if (err) reject(err);
      if (payload) resolve(payload);
    });
  });
};

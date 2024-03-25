import express, { json, urlencoded } from "express";
import cors from "cors"; // get MongoDB driver connection
import { connectToServer } from "./mongo/conn.js";
import passport from "passport";
import userRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import RegistrationRoutes from "./routes/RegistrationRoutes.js";
import accommodationRoutes from "./routes/accommodationRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import backupRoutes from "./routes/backupRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";
import { authorized, isAdmin } from "./middlewares/index.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "express-flash";
import { FRONTEND_URL } from "./production.config.js";
import statRoutes from "./routes/statRoutes.js";
import conflictRoutes from "./routes/conflictsRoutes.js";
import convenorAuthRoutes from "./routes/convenorAuthRoutes.js";

import "./config/passport.js";
import "./config/google.js";

const app = express();
const PORT = process.env.PORT || 4300;

app.use(cors());
app.use(json());
app.use(urlencoded());

app.use(cookieParser());

app.use(
  session({
    secret: "secr3t",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/google-failed`,
    failureMessage: "Invalid Credentials",
  }),
  (req, res) => {
    res.redirect(
      `${FRONTEND_URL}/auth?type=signup&page=details&source=google&email=${req._user.email}&existing=${req._isExistingUser}&gid=${req._user.googleId}`
    );
  }
);

app.get("/api/auth/logout", (req, res) => {
  req.flash("success", "Successfully logged out");
  req.session.destroy(function () {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.use("/api/auth", userRoutes);
app.use("/api/upload", authorized, uploadRoutes);
app.use("/api/register", RegistrationRoutes);
app.use("/api/acc", accommodationRoutes);
app.use("/api/paper", paperRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/statistics", statRoutes);
app.use("/api/all-data", backupRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/conflicts", conflictRoutes);
app.use("/api/convenor-auth", convenorAuthRoutes);

app.get("/", async (req, res) => {
  res.send("Welcome to the Yutira Backend SDK");
});

// perform a database connection when the server starts
connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

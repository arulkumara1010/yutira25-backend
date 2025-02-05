import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { BACKEND_URL } from "../production.config.js";

passport.use(
  new GoogleStrategy(
    {
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      clientID: "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",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({
          email: profile.emails[0].value,
        });
        if (!currentUser) {
          const newUser = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profilePhoto: profile.photos[0].value,
            source: "google",
            verified: true,
            lastVisited: new Date(),
          });

          req._user = newUser;
          req._isExistingUser = false;

          done(null, newUser);
        } else {
          currentUser.lastVisited = new Date();
          if (currentUser.source != "google") {
            return done(null, false, {
              message: `You have previously signed up with a different signin method`,
            });
          }
          req._user = currentUser;
          req._isExistingUser = currentUser.kriyaId !== null;

          done(null, currentUser);
        }
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);

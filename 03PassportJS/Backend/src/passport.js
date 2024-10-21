import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/socialSign/google/callback",
    },

    async function (accessTokenT, refreshTokenT, profile, done) { 
      console.log(profile);
      done(null,profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);  
});

passport.deserializeUser((user, done) => {
  done(null, user); 
});
const cookieSession = require("cookie-session");
require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./passport"); 
const authRoute = require("./routes/auth");
const app = express();

app.use(
  cookieSession({ 
    name: "session", 
    keys: ["secure_random_key"],  
    maxAge: 24 * 60 * 60 * 1000   
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",  
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoute);

app.listen("5100", () => {
  console.log("Server is running on port 5100!");
});

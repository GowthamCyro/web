import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import './passport.js';
import passport from "passport";
import session from 'express-session';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))
  
app.use(
    session({
      secret: 'your_secret_key', 
      resave: false,             
      saveUninitialized: true,   
      cookie: { secure: false }, 
    })
);

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use(passport.initialize());
app.use(passport.session());


// import routes
import userRouter from './routes/user.routes.js'
import socailRouter from './routes/google.routes.js'

//routes Declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/socialSign",socailRouter)

export {app}
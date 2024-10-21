import {Router} from "express";
import { googleAuthorize,googleCallback, loginFailed, loginSuccess,detailsUpdate } from "../controllers/google.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";
import passport from "passport";
import '../passport.js';

    const router = Router()

    router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
        success: true,
        message: "successful",
        user: req.user,
        });
    } else {
        res.status(403).json({ success: false, message: "Not authenticated" });
    }
    });

    router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
    });

    router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    router.get(
        "/google/callback",
        googleCallback
    );

    router.route("/updateDetails").post(verifyJWT,detailsUpdate);

export default router
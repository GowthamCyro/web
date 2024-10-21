import {Router} from "express";
import { changeCurrentPassword, forgotPasswordEmail,forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, verifyEmail } from "../controllers/user.controller.js";
import {upload} from "../middleware/mutler.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/:id/verify/:token").get(verifyEmail)
router.route("/forgotPassword").post(forgotPasswordEmail)
router.route("/reset-password/:token").post(forgotPassword)

// secured routes
router.route("/logout").get(verifyJWT,logoutUser);
router.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword);
router.route("/changeAvatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);
router.route("/changeCoverImage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage);
router.route("/updateAccountDetails").patch(verifyJWT,updateAccountDetails);
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser);




export default router
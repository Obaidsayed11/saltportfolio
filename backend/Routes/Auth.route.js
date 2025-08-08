import { Router} from "express"
import Controller from '../Controllers/Auth.Controller.js';
import authMiddleware from "../MiddleWare/auth.middleware.js";
import upload from '../MiddleWare/multer.middleware.js'
const {RegisterContoller, LoginController,userInfoController,LogoutController } = Controller;



const router = Router()

const uploadFile=upload.fields([
    {
        name:"profilePhoto",
        maxCount:1
    }
])

router.route('/login').post(LoginController)
router.route('/register').post(uploadFile,RegisterContoller);
router.route('/logout').post(authMiddleware, LogoutController)
router.route('/userInfo').get(authMiddleware,userInfoController)


export default router
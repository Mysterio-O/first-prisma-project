import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = express.Router();



declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean
            }
        }
    }
}


router.get("/", postController.getAllPost)

router.get("/:id", postController.getSinglePost)

router.get('/me/my-posts', auth(UserRole.ADMIN, UserRole.USER), postController.getMyPosts);

router.patch("/:postId",auth(UserRole.ADMIN,UserRole.USER),postController.updatePost)

router.post("/", auth(UserRole.USER,UserRole.ADMIN), postController.createPost)

export const postRouter = router;
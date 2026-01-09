import express from "express";
import { commentControllers } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = express.Router();

// console.log('Route registered with roles:', UserRole.ADMIN, UserRole.USER);

router.get("/:id", commentControllers.getCommentByPost)

router.post("/", auth(UserRole.ADMIN, UserRole.USER), commentControllers.createComment)



export const commentRouter = router;
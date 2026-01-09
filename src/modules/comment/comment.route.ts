import express from "express";
import { commentControllers } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = express.Router();

// console.log('Route registered with roles:', UserRole.ADMIN, UserRole.USER);

router.get("/:id", commentControllers.getCommentByPost)

router.get("/byId/:id", commentControllers.getCommentById);
router.get("/byAuthor/:id", commentControllers.getCommentsByAuthor);

router.post("/", auth(UserRole.ADMIN, UserRole.USER), commentControllers.createComment);

router.patch("/:id",auth(UserRole.ADMIN,UserRole.USER),commentControllers.updateComment);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), commentControllers.deleteComment);




export const commentRouter = router;
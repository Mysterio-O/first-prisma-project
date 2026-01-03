import { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.body) return;
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: "unauthorized"
            })
        }
        console.log(req.user)
        const result = await postService.createPost(req.body, req.user.id);
        res.status(201).json({
            success: true,
            result
        })
    }
    catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            err
        })
    }
}


export const postController = {
    createPost
}
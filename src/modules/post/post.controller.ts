import { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.body) return;
        const result = await postService.createPost(req.body);
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
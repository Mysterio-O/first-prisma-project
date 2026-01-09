import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    const user = req.user;
    if (!req.body) {
        throw new Error("Body not found");
    };
    if (!user) {
        throw new Error("User not found")
    }
    req.body.authorId = user?.id;
    try {
        const result = await commentServices.createComment(req.body);
        res.status(201).json({
            success: true,
            message: 'comment posted successfully'
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({
            success: false,
            error: "failed to post comment",
            details: e
        })
    }
};

const getCommentByPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Post id not found")
        }
        const result = await commentServices.getCommentsByPost(id);
        res.status(200).json({
            success: true,
            result
        })
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            error: "failed to get comments",
            details: e
        })
    }
}

export const commentControllers = {
    createComment,
    getCommentByPost
}
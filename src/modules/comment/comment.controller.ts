import { Request, Response } from "express";
import { commentServices } from "./comment.service";
import { success } from "better-auth/*";

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
};

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Comment id not found")
        }
        const result = await commentServices.getCommentById(id);
        res.status(200).json({
            success: true,
            result
        })
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            error: "failed to get comment by id",
            details: e
        })
    }
}

const getCommentsByAuthor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Author id not found")
        }
        const result = await commentServices.getCommentsByAuthor(id);

        res.status(200).json({
            success: true,
            result
        })
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            error: "failed to get comment by author id",
            details: e
        })
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = req.user;

        if (typeof user === 'undefined') {
            return res.status(401).json({
                success: false,
                message: "unauthorized access"
            })
        }

        if (!id) {
            throw new Error("Comment id not found")
        }


        await commentServices.deleteComment(id, user.id as string);

        res.status(200).json({
            success: true,
            message: 'comment deleted successfully'
        })
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            error: "failed to delete comment",
            details: e
        })
    }
};

const updateComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const user = req.user;

    if (!id) {
        throw new Error("Comment id not found");
    }
    if (!data) {
        throw new Error("Update body not found");
    };

    if (typeof user === 'undefined') {
        return res.status(401).json({
            success: false,
            message: "unauthorized access"
        })
    }

    const result = await commentServices.updateComment({ commentId: id, data, authorId: user.id });

    res.status(200).json({
        success: true,
        result
    })

    try {

    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            error: "failed to update comment",
            details: e
        })
    }
}

export const commentControllers = {
    createComment,
    getCommentByPost,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment
}
import { Request, Response } from "express"
import { postService } from "./post.service"
import { PostStatus } from "../../../generated/prisma/enums";
import paginationAndSortingHelper from "../../helpers/paginationAndSorting";

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


const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const query = typeof search === 'string' ? search : undefined;
        // console.log(query)

        const tags = req.query.tags ? req.query.tags : ''

        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined;

        // console.log({ isFeatured })

        const status = req.query.status as PostStatus | undefined;

        const authorId = req.query.authorId as string | undefined;

        const options = paginationAndSortingHelper(req.query)
        // console.log(options)
        const { page, limit, skip, sortBy, sortOrder } = options

        const posts = await postService.getAllPost({ search: query, tags: tags as string, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });

        res.status(200).json({
            success: true,
            count: posts.length,
            result: posts
        })
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            message: "Failed to get posts",
            details: e
        })
    }
}


const getSinglePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id as string;
        if (!postId) {
            throw new Error('Post id not found')
        }
        const result = await postService.getSinglePost(postId);
        res.status(200).json({
            success: true,
            result
        })
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            message: "Failed to get post",
            details: e
        })
    }
};

const getMyPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "unauthorized access"
            })
        }
        const result = await postService.getMyPosts(user.id);
        res.status(200).json({
            success: true,
            count: result.length,
            result
        })
    }
    catch (e) {
        console.error(e);
        const errMessage = (e instanceof Error) ? e.message : "Failed to get posts";
        res.status(400).json({
            success: false,
            error: "failed to get posts",
            details: errMessage
        })
    }
}

export const postController = {
    createPost,
    getAllPost,
    getSinglePost,
    getMyPosts
}
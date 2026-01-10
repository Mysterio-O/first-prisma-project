import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"


type ICreateComment = {
    authorId: string;
    postId: string;
    content: string;
    parentId?: string;
}
const createComment = async (payload: ICreateComment) => {
    return await prisma.comment.create({
        data: payload
    })
};


const getCommentsByPost = async (postId: string) => {
    return await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        include: {
            comments: true
        }
    })
};

const getCommentById = async (commentId: string) => {
    return await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
}

const getCommentsByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: { createdAt: 'desc' },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

const deleteComment = async (commentId: string, authorId: string) => {

    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true,
        }
    });
    if (!comment) {
        throw new Error("Comment not found")
    }
    console.log(comment)

    return await prisma.comment.delete({
        where: {
            id: commentId
        }
    })
};

type UpdateCommentPayload = {
    commentId: string;
    authorId: string;
    data: {
        content?: string;
        status?: CommentStatus
    }
}
const updateComment = async (payload: UpdateCommentPayload) => {
    const { commentId, authorId, data } = payload;
    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });

    if (commentData.status === data.status) {
        throw new Error(`Your provided status (${data.status}) is already up to date.`)
    }

    return await prisma.comment.update({
        where: {
            id
        },
        data
    })
}

export const commentServices = {
    createComment,
    getCommentsByPost,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateComment,
}
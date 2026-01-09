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
}

export const commentServices = {
    createComment,
    getCommentsByPost
}
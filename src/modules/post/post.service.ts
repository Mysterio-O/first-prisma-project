import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });
    return result;
}

const getAllPost = async (payload: { search: string | undefined, tags: string, isFeatured: boolean | undefined, status: PostStatus | undefined, authorId: string | undefined, page: number, limit: number, skip: number, sortBy: string, sortOrder: string }) => {

    const { tags, isFeatured, status, authorId, limit, skip, sortBy, sortOrder } = payload;

    const sorted = tags?.split(',');

    const andConditions: PostWhereInput[] = [];

    if (payload.search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: payload.search as string,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: payload.search as string,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        has: payload.search as string
                    }
                }
            ]
        })
    }

    if (tags.length > 0) {
        andConditions.push(
            {
                tags: {
                    hasEvery: sorted
                }
            }
        )
    };

    if (typeof isFeatured === 'boolean') {
        andConditions.push({
            isFeatured
        })
    };

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            authorId
        })
    }

    return await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });
};

const getSinglePost = async (id: string) => {
    // console.log('post id',id)
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: id
            },
            data: {
                views: {
                    increment: 1
                }
            }
        });
        const postData = await tx.post.findUnique({
            where: {
                id: id
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: {
                                createdAt: "asc"
                            },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: {
                                        createdAt: "asc"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return postData
    })
}


const getMyPosts = async (id: string) => {
    return await prisma.post.findMany({
        where: {
            authorId: id
        },
        orderBy: {
            createdAt: "desc"
        }
    })
};


const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not the owner/creator of the post!")
    }

    if (!isAdmin) {
        delete data.isFeatured
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id
        },
        data
    })

    return result;

}


export const postService = {
    createPost,
    getAllPost,
    getSinglePost,
    getMyPosts,
    updatePost
}
import { prisma } from "../../utils/prisma"
import { IAuthUser } from "../user/user.interface";
import { IVote } from "./vote.interface";


const createVote = async (payload: IVote, user: IAuthUser) => {
    let isVoteExists;
    let isIdeaExists;
    let isBlogExists;
    if (payload.ideaId) {
        isVoteExists = await prisma.vote.findUnique({
            where: {
                voterId_ideaId: {
                    voterId: user.userId,
                    ideaId: payload.ideaId
                }
            }
        })
        isIdeaExists = await prisma.idea.findUnique({
            where: {
                id: payload.ideaId
            }
        })
    }
    if (payload.blogId) {
        isVoteExists = await prisma.vote.findUnique({
            where: {
                voterId_blogId: {
                    voterId: user.userId,
                    blogId: payload.blogId

                }
            }
        })
        isBlogExists = await prisma.blog.findUnique({
            where: {
                id: payload.blogId
            }
        })
    }
    if (payload.ideaId && !isIdeaExists) {
        throw new Error("Idea doesnot exists");
    }
    if (payload.blogId && !isBlogExists) {
        throw new Error("Blog doesnot exists");
    }
    let result;

    if (isVoteExists) {
        if ((isVoteExists.blogId === payload.blogId && isVoteExists.voterId === user.userId) || (isVoteExists.ideaId === payload.ideaId && isVoteExists.voterId === user.userId)) {
            result = await prisma.vote.update({
                where: {
                    id: isVoteExists.id
                },
                data: {
                    value: payload.value
                }
            })
        }

    }
    else {
        result = await prisma.vote.create({
            data: {
                ...payload,
                voterId: user.userId
            }
        })
    }
    return result
}
const removeVote = async (payload: Partial<IVote>, user: IAuthUser) => {
    let isVoteExists
    if (payload.ideaId) {
        isVoteExists = await prisma.vote.findUnique({
            where: {
                voterId_ideaId: {
                    voterId: user.userId,
                    ideaId: payload.ideaId
                }
            }
        })
    } else if (payload.blogId) {
        isVoteExists = await prisma.vote.findUnique({
            where: {
                voterId_blogId: {
                    voterId: user.userId,
                    blogId: payload.blogId
                }
            }
        })
    }
    if (!isVoteExists) {
        throw new Error("Vote is not found")
    }
    const result = await prisma.vote.delete({
        where: {
            id: isVoteExists.id
        }
    })
    return result
}
export const voteServices = {
    createVote,
    removeVote
}
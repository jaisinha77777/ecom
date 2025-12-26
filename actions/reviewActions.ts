'use server'

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { getCldImageUrl } from "next-cloudinary"


export async function createReview(data: {
    rating: number
    review_text?: string
    productId: string,
    title?: string,
}) {

    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")

        await prisma.productReview.upsert({
            where: {
                product_id_user_id: {
                    product_id: data.productId,
                    user_id: userId,
                }
            },
            update: {
                rating: data.rating,
                review_text: data.review_text,
                product_id: data.productId,
                user_id: userId,
                title: data.title,
            },
            create: {
                rating: data.rating,
                review_text: data.review_text,
                product_id: data.productId,
                user_id: userId,
                title: data.title,
            }
        })

        // Calculate new average rating and update product
        const reviews = await prisma.productReview.findMany({
            where: { product_id: data.productId }
        })

        return true;
    } catch (error) {
        console.log("Error creating review: ", error)
        return false;
    }
}

export async function getReviewsByProductId(productId: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")
        const reviews = await prisma.productReview.findMany({
            where: {
                product_id: productId,

                user_id: {
                    not: userId
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        return reviews;
    } catch (error) {
        console.log("Error fetching reviews: ", error)
        return [];
    }
}

export async function getMyReviewForProduct(productId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return null;
        const review = await prisma.productReview.findFirst({
            where: {
                product_id: productId,
                user_id: userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })
        return review;
    } catch (error) {
        console.log("Error fetching my review: ", error)
        return null;
    }
}


export async function deleteReview(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")
        const deletedReview = await prisma.productReview.delete({
            where: {
                review_id: id,
            },

        })
        // Update average rating after deletion

        return true;
    } catch (error) {
        console.log("Error deleting review: ", error)
        return false;
    }
}


export async function getUserReviews() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")
        const reviews = await prisma.productReview.findMany({
            where: {
                user_id: userId,
            },
            include: {
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        images: true,
                    }
                }
            },
        })
        const formattedReviews = reviews.map(review => {
            return {
                ...review,
                image: getCldImageUrl({ src: review.product.images[0], width: 100, height: 100, crop: 'fill' }),
                images: undefined,
            }
        }
        )
        return formattedReviews;
    } catch (error) {
        console.log("Error fetching user reviews: ", error)
        return [];
    }
}


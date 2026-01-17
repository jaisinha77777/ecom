'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserDataForRecommendations() {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        // Fetch user searches
        const searches = await prisma.searchQuery.findMany({
            where: { userId },
            select: {
                searchQuery: true,
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        category: { select: { categoryName: true } },
                        tags: true,
                    }
                },
                searchedProducts: {
                    select: {
                        product: {
                            select: {
                                productId: true,
                                productName: true,
                                category: { select: { categoryName: true } },
                                tags: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        // Fetch user reviews
        const reviews = await prisma.productReview.findMany({
            where: { user_id: userId },
            select: {
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        category: { select: { categoryName: true } },
                        tags: true,
                    }
                },
                rating: true,
            },
        });

        // Fetch user interactions
        const interactions = await prisma.userProductInteraction.findMany({
            where: { userId },
            select: {
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        category: { select: { categoryName: true } },
                        tags: true,
                    }
                },
                interactionType: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        // Fetch user views
        const views = await prisma.productView.findMany({
            where: { userId },
            select: {
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        category: { select: { categoryName: true } },
                        tags: true,
                    }
                },
                viewDurationSeconds: true,
            },
            orderBy: { viewedAt: 'desc' },
            take: 30,
        });

        return { searches, reviews, interactions, views };
    } catch (error) {
        console.error("Error fetching user data for recommendations:", error);
        return null;
    }
}

export async function getAllProductsForSimilarity() {
    try {
        return await prisma.product.findMany({
            select: {
                productId: true,
                productName: true,
                category: { select: { categoryName: true } },
                tags: true,
                description: true,
            },
        });
    } catch (error) {
        console.error("Error fetching products for similarity:", error);
        return [];
    }
}

'use server'

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createProductView({ productId, source, viewedAt, viewDuration, filterCategory }: {
    productId: string,
    source: "direct" | "home" | "category" | "search"
    viewedAt: Date,
    viewDuration: number,
    filterCategory?: string
}) {
    try {
        const { userId } = await auth();
        if (!userId) return;

        console.log(filterCategory)

        await prisma.productView.create({
            data: {
                productId: productId,
                userId: userId,
                viewedAt,
                viewDurationSeconds: viewDuration,
                viewSource: source,
                filterCategoryName: (!filterCategory || filterCategory.toLowerCase() === 'all categories' ? null : filterCategory)
            }
        })
    } catch (error) {
        console.log("Error creating product view:", error);

    }
}


/*
  add_to_cart
  remove_from_cart
  add_to_wishlist
  remove_from_wishlist
  purchase
  review
*/
export async function createProductUserInteraction({ productId, interaction_type }) {
    try {
        const { userId } = await auth();
        if (!userId) return;
        await prisma.userProductInteraction.create({
            data: {
                productId,
                userId,
                interactionType: interaction_type
            }
        })


    } catch (error) {
        console.log("Error creating product interaction:", error);
        
    }
}
'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSearchLog({ searchQuery, clickedProductId = null, searchedProductIds = [] }: { searchQuery: string; clickedProductId?: string | null; searchedProductIds?: string[] }) {
  try {
    const {userId} = await auth() 
    if(!userId) {
        return;
    }

    if(clickedProductId){
        await prisma.searchQuery.create({
            data: {
                userId,
                searchQuery,
                clickedProductId,
            }
        });

    }

    else{
       const searchQueryId = await prisma.searchQuery.create({
            data: {
                userId,
                searchQuery,
            },
            select: {
                queryId: true,
            }
        });

        console.log("Created search query with ID:", searchQueryId);

        // For each searched product, create a SearchQueryProduct entry
                    const searchQueryProductsData = searchedProductIds.map((productId) => ({
                        searchQueryId: searchQueryId.queryId,
                        productId,
                    }));

        await prisma.searchQueryProduct.createMany({
            data: searchQueryProductsData,
        });

    }

  } catch (error) {
    console.log("Error creating search log:", error);
  }
}
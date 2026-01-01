'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSearchLog({ searchQuery, clickedProductId = null, searchedProductIds = [] }: { searchQuery: string; clickedProductId?: string | null; searchedProductIds?: string[] }) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return;
        }

        if (clickedProductId) {
            await prisma.searchQuery.create({
                data: {
                    userId,
                    searchQuery,
                    clickedProductId,
                }
            });

        }

        else {
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

export async function getSearchLogsHome() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return;
        }
        return await prisma.searchQuery.findMany({
            where: {
                userId,
            },
            select: {
                product: {
                    select: {
                        productName: true,
                        productId: true,
                    }
                },
                searchQuery: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });


    } catch (error) {
        console.log(error)
    }
}
const PAGE_SIZE = 10;

export async function getSearchQueries(page = 1) {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const [items, total] = await Promise.all([
      prisma.searchQuery.findMany({
        where: { userId },
        select: {
          product: {
            select: {
              productName: true,
              productId: true,
            }
          },
          searchQuery: true,
          createdAt: true,
            queryId: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),

      prisma.searchQuery.count({
        where: { userId }
      })
    ]);

    return {
      items,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE)
    };

  } catch (err) {
    console.error(err);
    return null;
  }
}


export async function deleteSearchQuery(id: number) {
    try {
        const { userId } = await auth();
        if (!userId) return;
        console.log("Deleting search query with ID:", id);
        await prisma.searchQuery.delete({
            where: {
                queryId: id,
                userId,
            }
        });
    } catch (err) {
        console.error(err);
    }
}
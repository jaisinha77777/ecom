'use server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server';
import { createProductUserInteraction } from './viewActions';


export async function addToCart(productId: string, quantity: number) {
    // If already in cart, then it is update quantity else add new item to cart
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        // Find product in cart 

        const alreadyInCart = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId
                }
            }
        })

        if (!alreadyInCart) {
            await createProductUserInteraction({ productId: productId, interaction_type: 'add_to_cart' });
        }

        await prisma.cartItem.upsert({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId
                }
            },
            update: {
                quantity: quantity,
            },
            create: {
                userId: userId,
                productId: productId,
                quantity: quantity,
            }
        })


        return true;

    } catch (error) {
        console.error("Error adding to cart:", error);
        return null;
    }


}

export async function deleteFromCart(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }


        const {productId} = await prisma.cartItem.findUnique({
            where: {
                cartItemId: parseInt(id)
            },
            select: {
                productId: true
            }
        })

        await createProductUserInteraction({ productId: productId, interaction_type: 'remove_from_cart' });

        await prisma.cartItem.delete({
            where: {
                cartItemId: parseInt(id)
            }
        })
        return true;

    } catch (error) {
        console.error("Error deleting from cart:", error);
        return null;
    }
}

export async function toggleWishlist(productId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId
                }
            }
        })
        if (existingItem) {
            await prisma.wishlistItem.delete({
                where: {
                    userId_productId: {
                        userId: userId,
                        productId: productId
                    }
                }

            })
            await createProductUserInteraction({ productId: productId, interaction_type: 'remove_from_wishlist' });
            return true;
        }
        await prisma.wishlistItem.create({
            data: {
                userId: userId,
                productId: productId,
            }
        })

        await createProductUserInteraction({ productId: productId, interaction_type: 'add_to_wishlist' });

        return true;
    } catch (error) {
        console.error("Error deleting from wishlist:", error);
        return null;
    }

}
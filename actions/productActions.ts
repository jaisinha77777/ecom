'use server'
import prisma from '@/lib/prisma'
import { productSchema } from '@/schemas/productSchema';
import { auth } from '@clerk/nextjs/server';
import { getCldImageUrl } from 'next-cloudinary';
import { deleteImage, uploadImage } from './uploadImage';
const categories = [
    "Electronics",
    "Clothing & Fashion",
    "Footwear",
    "Home",
    "Furniture",
    "Kitchen",
    "Beauty",
    "Personal Care",
    "Grocery",
    "Health",
    "Sports",
    "Fitness",
    "Books",
    "Stationery",
    "Toys",
    "Baby Products",
    "Automotive",
    "Appliances",
    "Tools",
    "Office Supplies",
    "Jewelry",
    "Watches",
    "Bags & Luggage",
    "Digital Products",
    "Gifts & Seasonal",
]

const categoryMap = new Map<string, number>()

categories.forEach((category, index) => {
    categoryMap.set(category, index + 1)
})
export async function getProductsByCategory(category: string) {
    try {

        const { userId } = await auth();

        console.log("Fetching products for category:", category);
        let products;
        // return null
        if (category === 'All Categories') {
            products = await prisma.product.findMany({
                where: {
                    stockQuantity: { gt: 0 }
                },
                include: {
                    category: {
                        select: {
                            categoryName: true
                        }
                    },
                    brand: {
                        select: {
                            brandName: true
                        }
                    },
                    wishlistItems: {
                        where: {
                            userId: userId || ''
                        },
                        select: {
                            wishlistId: true
                        },
                        take: 1
                    },
                    cartItems: {
                        where: {
                            userId: userId || ''
                        },
                        select: {
                            cartItemId: true
                        },
                        take: 1
                    }
                }
            })
        }
        else {
            products = await prisma.product.findMany({
                where: {
                    categoryId: categoryMap.get(category),
                    stockQuantity: { gt: 0 }
                },
                include: {
                    category: {
                        select: {
                            categoryName: true
                        }
                    },
                    brand: {
                        select: {
                            brandName: true
                        }
                    },
                    wishlistItems: {
                        where: {
                            userId: userId || ''
                        },
                        select: {
                            wishlistId: true
                        },
                        take: 1
                    },
                    cartItems: {
                        where: {
                            userId: userId || ''
                        },
                        select: {
                            cartItemId: true
                        },
                        take: 1
                    }
                }
            })

        }



        const res = products.map((product) => ({
            ...product,
            image:
                getCldImageUrl({
                    src: product.images[0],
                    width: 400,
                    height: 500,
                    quality: "auto",
                }),
            isSaved: product.wishlistItems.length > 0,
            inCart: product.cartItems.length > 0,
            wishlistItems: undefined,
            cartItems: undefined
        }))


        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return null;
    }

}

export async function getProductById(productId: string) {
    try {
        const { userId } = await auth();
        console.log("Fetching product with id:", productId);
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const product = await prisma.product.findUnique({
            where: {
                productId: productId
            },
            include: {
                category: {
                    select: {
                        categoryName: true
                    }
                },

                brand: {
                    select: {
                        brandName: true
                    }
                },
                wishlistItems: {
                    where: {
                        userId: userId
                    },
                    select: {
                        wishlistId: true
                    },
                    take: 1
                },
                cartItems: {
                    where: {
                        userId: userId || ''
                    },
                    select: {
                        cartItemId: true,
                        quantity: true
                    },
                    take: 1
                }
            }
        });
        if (!product) {
            console.log("No product found with id:", productId);
            return null;
        }
        const res = {
            ...product,
            images: product.images.map((publicId) =>
                getCldImageUrl({
                    src: publicId,
                    width: 700,
                    height: 800,
                    quality: "auto",
                })
            ),
            isSaved: product.wishlistItems.length > 0,
            inCart: product.cartItems.length > 0,
            wishlistItems: undefined,
            cartItems: undefined,
            quantity: product.cartItems.length > 0 ? product.cartItems[0].quantity : 0
        }
        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.error("Error fetching product by id:", error);
        return null;
    }
}


export async function getWishList() {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        // Return all wishlist items for the user with productName, price, image[0], productId, isSaved, cost

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: {
                userId: userId
            },
            include: {
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        price: true,
                        images: true,
                        cost: true,



                        category: {
                            select: {
                                categoryName: true
                            }
                        },
                        brand: {
                            select: {
                                brandName: true,

                            }
                        },
                        cartItems: {
                            where: {
                                userId: userId
                            },
                            select: {
                                cartItemId: true
                            },
                            take: 1
                        },

                    },

                }
            }
        });


        const res = wishlistItems.map((item) => ({
            id: item.wishlistId.toString(),
            productId: item.product.productId,
            productName: item.product.productName,
            price: item.product.price,
            image: getCldImageUrl({
                src: item.product.images[0],
                width: 400,
                height: 500,
                quality: "auto",
            }),
            inCart: item.product.cartItems.length > 0,
            cost: item.product.cost,
            category: item.product.category?.categoryName,
            brand: item.product.brand?.brandName
        }));

        console.log(res)

        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
}

export async function getCartItems() {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId: userId
            },
            include: {
                product: {
                    select: {
                        productId: true,
                        productName: true,
                        price: true,
                        images: true,
                        category: {
                            select: {
                                categoryName: true
                            }
                        },
                        brand: {
                            select: {
                                brandName: true
                            }
                        },
                        stockQuantity: true
                    }
                }
            }
        })
        const res = cartItems.map((item) => ({
            id: item.cartItemId.toString(),
            productId: item.product.productId,
            productName: item.product.productName,
            price: item.product.price,
            image: getCldImageUrl({
                src: item.product.images[0],
                width: 400,
                height: 500,
                quality: "auto",
            }),
            quantity: item.quantity,
            category: item.product.category?.categoryName,
            brand: item.product.brand?.brandName,
            stockQuantity: item.product.stockQuantity
        }))
        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return [];
    }
}

export async function getProductsByDealer() {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const products = await prisma.product.findMany({
            where: {
                by: userId
            },
            select: {
                productId: true,
                productName: true,
                price: true,
                stockQuantity: true,
                createdAt: true,
                brand: {
                    select: {
                        brandName: true
                    }
                },
                category: {
                    select: {
                        categoryId: true,
                        categoryName: true
                    }
                }
            }
        })

        const parsedProducts = products.map((product) => ({
            id: product.productId,
            name: product.productName,
            price: product.price,
            stockQuantity: product.stockQuantity,
            createdAt: product.createdAt,
            brand: product.brand?.brandName,
            category: product.category?.categoryName,

        }))
        return JSON.parse(JSON.stringify(parsedProducts));

    } catch (error) {
        console.log("Error fetching dealer products:", error);
        return [];
    }
}


export async function updateProduct({ productId, images, data }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        // Find product 
        const product = await prisma.product.findUnique({
            where: {
                productId: productId,
                by: userId
            }
        }
        )

        if(images==null){
            throw new Error("No images provided");
        }

        if (!product) {
            throw new Error("Product not found or you do not have permission to edit this product");
        }

        // Remove old images from Cloudinary if new images are uploaded

        for (const publicId of product.images) {
            await deleteImage(publicId);
        }

        // Upload new images to Cloudinary
        const uploadedImageIds = await uploadImage(images);
        console.log("Received data " , data)
        // Update product in database
        const brandRecord = await prisma.brand.upsert({
            where: { brandName: data.brand.toLowerCase() },
            update: {},
            create: { brandName: data.brand.toLowerCase() },
        })
        await prisma.product.update({
            where: {
                productId: productId,
                by : userId
            },
            data: {
                productName: data.productName,
                price : data.price,
                cost : data.cost,
                stockQuantity : data.stockQuantity,
                description: data.description,
                brandId: brandRecord.brandId,
                categoryId: data.category,
                images: uploadedImageIds
            }
        }) 

        return {
            message : "Product updated successfully",
            success : true 
        };



    } catch (error) {
        console.log("Error updating product:", error);
        return {
            message : "Error updating product: " + (error as Error).message,
            success : false 
        };
    }
}



export async function updateProductStockAndPrice({productId, stockQuantity, price}: {productId: string, stockQuantity: number, price: number}) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        await prisma.product.update({
            where: {
                productId: productId,
                by: userId
            },
            data: {
                stockQuantity: stockQuantity,
                price: price
            }
        })
    } catch (error) {
        
    }
}

export async function deleteProduct(productId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        // Find product and delete the cloudinary images
        const productImages = await prisma.product.findUnique({
            where: {
                productId ,
                by: userId
            },
            select: {
                images: true
            }

        })


        for (const publicId of productImages?.images || []) {
            await deleteImage(publicId);
        }

        await prisma.product.delete({
            where: {
                productId ,
                by: userId
            }
        })
        
    } catch (error) {
        console.log("Error deleting product:", error);
        return null 
    }

}
'use server'
import prisma from '@/lib/prisma'
import { productSchema } from '@/schemas/productSchema';
import { auth } from '@clerk/nextjs/server';
import { getCldImageUrl } from 'next-cloudinary';
import { uploadImage } from './uploadImage';
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
        if(!userId){
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
            quantity : product.cartItems.length > 0 ? product.cartItems[0].quantity : 0
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
            id : item.wishlistId.toString(),
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
                        stockQuantity : true 
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
            stockQuantity : item.product.stockQuantity
        }))
        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return [];
    }
}


export async function uploadBulkProducts(rows: any[]) {
  let success = 0
  let failed = 0

  for (const row of rows) {
    try {
      const parsed = productSchema.parse({
        productName: row.productName,
        description: row.description,
        brand: row.brand,
        category: Number(row.category),
        price: Number(row.price),
        cost: Number(row.cost),
        stockQuantity: Number(row.stockQuantity),
        currency: row.currency ?? "INR",
      })
    //   images of the product are provided as | separated urls in the CSV
        let images: File[] = []

      if (row.imageUrls) {
        const urls = row.imageUrls.split("|")

        for (const url of urls) {
          const res = await fetch(url)
          const blob = await res.blob()

          const file = new File([blob], url.split("/").pop() ?? "image.jpg", {
            type: blob.type,
          })

          images.push(file)
        }
      }
      const cloudinaryIds = await uploadImage(images)

        await prisma.product.create({
            data: {
                productName: parsed.productName,
                description: parsed.description,
                brandId: (await prisma.brand.upsert({
                    where: { brandName: parsed.brand.toLowerCase() },
                    update: {},
                    create: { brandName: parsed.brand.toLowerCase() },  
                })).brandId,
                categoryId: parsed.category,
                price: parsed.price,
                currency: parsed.currency,
                stockQuantity: parsed.stockQuantity,
                cost: parsed.cost,
                images: cloudinaryIds,
            },
        })

      success++

    } catch (e) {
      console.log("Failed row:", row)
      failed++
    }
  }

  return {
    message: `Uploaded ${success} products. Failed: ${failed}`,
  }
}
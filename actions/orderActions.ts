'use server'

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { getCldImageUrl } from "next-cloudinary";

export async function createOrder({
    addressId, paymentMethod, checkoutItems
}) {
    // Logic to create order from cart
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        console.log("Creating order for user:", userId);
        console.log("Checkout items:", checkoutItems);




        if (checkoutItems.length === 0) {
            throw new Error("Order is empty");
        }

        let subtotal = 0;
        checkoutItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        await prisma.$transaction(async (tx) => {

            const { userId } = await auth();
            if (!userId) throw new Error("Not authenticated");

            let subtotal = checkoutItems.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
            );

            const order = await tx.order.create({
                data: {
                    user_id: userId,
                    subtotal,
                    total_amount: subtotal,
                    status: "confirmed",
                    payment_status: "paid",
                    payment_method: paymentMethod,
                    shipping_address_id: addressId,
                }
            });

            for (const item of checkoutItems) {

                // lock + update stock safely
                const updated = await tx.product.update({
                    where: {
                        productId: item.id,
                        stockQuantity: { gte: item.quantity } // ensure enough stock
                    },
                    data: {
                        stockQuantity: { decrement: item.quantity }
                    }
                });

                // if product didn’t update → stock insufficient
                if (!updated) throw new Error("Insufficient stock");

                await tx.orderItem.create({
                    data: {
                        order_id: order.order_id,
                        product_id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        product_name: item.name,
                        total_amount: item.price * item.quantity,
                    }
                });

                await tx.userProductInteraction.create({
                    data : {
                        productId : item.id,
                        interactionType : 'purchase',
                        userId : userId
                    }
                })
            }

            return order.order_id;
        });

    } catch (error) {
        console.log("Error in createOrderFromCart action :", error);
        return null;
    }
}


export async function getOrdersByUser() {
    // Logic to get orders by user
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        console.log("Fetching orders for user:", userId);
        const orders = await prisma.order.findMany({
            where: {
                user_id: userId,
            },
            select: {
                order_id: true,
                total_amount: true,
                status: true,
                created_at: true,
                items: {
                    select: {
                        product_name: true,
                    }
                }
            },
            orderBy: {
                created_at: 'desc',
            },

        });
        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.log("Error in getOrdersByUser action :", error);
        return [];
    }
}


export async function getOrderById(orderId: string) {
    try {
        // Logic to get order by ID
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        console.log("Fetching order for user:", userId, "and orderId:", orderId);
        const order = await prisma.order.findFirst({
            where: {
                order_id: orderId,
            },
            select: {
                items: {
                    where: {
                        order_id: orderId,
                    },
                    select: {
                        product_name: true,
                        quantity: true,
                        price: true,
                        total_amount: true,
                        product: {
                            select: {
                                images: true,
                            }
                        },
                        order_id: true,

                    }
                },
                total_amount: true,
                status: true,
                payment_method: true,
                shipping_address_id: true,
            }
        });
        if (!order) {
            throw new Error("Order not found");
        }

        const temp = order.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                image: getCldImageUrl({
                    src: item.product.images?.[0],
                    height: 200,
                    width: 200,
                    crop: 'fill'
                }) ?? null,
                images: undefined
            }
        }));

        return JSON.parse(JSON.stringify({
            ...order,
            shipping_address_id: order.shipping_address_id.toString(),
            items: temp
        }));


    } catch (error) {
        console.log("Error in getOrderById action :", error);
        return null;
    }

}


export async function updateOrder({ orderId: string, updateData }) {
    // Logic to update order
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

}


'use server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server';


export async function addAddress(addressData: {
    name: string,
    address_line1: string,
    address_line2?: string,
    city: string,
    state?: string,
    pincode: string,
}) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        console.log("Adding address for user:", userId, addressData);
        await prisma.userAddress.create({
            data: {
                name: addressData.name,
                user_id: userId,
                address_line1: addressData.address_line1,
                address_line2: addressData.address_line2,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pincode,
            }
        })
        console.log("Address added successfully for user:", userId);
        return true;
    } catch (error) {
        console.error("Error adding address:", error);
        return null;
    }
}

export async function getUserAddresses() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const addresses = await prisma.userAddress.findMany({
        where: {
            user_id: userId,
        },
        
        orderBy: {
            created_at: 'desc',
        },

    });
    return addresses;
}

export async function deleteAddress(addressId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        await prisma.userAddress.delete({
            where: {
                address_id: parseInt(addressId),
            },
        });
        return true;
    } catch (error) {
        console.error("Error deleting address:", error);
        return null;
    }
}


export async function updateAddress(addressId: string, addressData: {
    name: string,
    address_line1: string,
    address_line2?: string,
    city: string,
    state?: string,
    pincode: string,
}) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        await prisma.userAddress.update({
            where: {
                address_id: parseInt(addressId),
            },
            data: {
                name: addressData.name,
                address_line1: addressData.address_line1,

                address_line2: addressData.address_line2,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pincode,
            }
        })
        return true;
    } catch (error) {
        console.error("Error updating address:", error);
        return null;
    }
}


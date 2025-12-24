"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";

export async function getUserRole() {
    try {
        console.log("Fetching user role");
        const { userId } = await auth()
        if (!userId) {
            console.log("No user id found");
            return null;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId!
            },
            select: {
                role: true
            }
        })

        return user?.role || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

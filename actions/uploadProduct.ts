"use server"
import { z } from "zod"
import { productSchema } from "@/schemas/productSchema"
import prisma from "@/lib/prisma"
import { uploadImage } from "./uploadImage"
import { auth } from "@clerk/nextjs/server"
export async function uploadProduct(data:  z.infer<typeof productSchema> , images : File[]) {
    try {
        const {currency,price,productName,stockQuantity,brand,category,description,cost,tags}  = data
        // Upload images and get their URLs or IDs
        // if brand does not exist, create it
        const {userId} =  await auth() ;

        console.log("User ID:", userId);

       const brandRecord = await prisma.brand.upsert({
            where: { brandName: data.brand.toLowerCase() },
            update: {},
            create: { brandName: data.brand.toLowerCase() },
        })

        
        const results = await uploadImage(images) 
        
        // Save product details to your database
       await prisma.product.create({
            data: {
                productName,
                description,
                brandId : brandRecord.brandId,
                categoryId: category,
                price,
                currency,
                stockQuantity,
                cost,
                tags,
                images: results,
                by : userId!,
                // images: JSON.stringify(imageUrls), // Assuming you store image URLs as JSON
            },
        })


        // If new category or brand is found in the data, create them in the database
        console.log(data) ;
        console.log(images)

        return { success: true, message: "Product uploaded successfully" };



        
    } catch (error) {
        console.log("Error uploading product:", error);
        return { success: false, message: "Error uploading product: " + (error as Error).message };
    }

}
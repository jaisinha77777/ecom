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


export async function uploadBulkProducts(rows: any[]) {
  let success = 0
  let failed = 0
  const { userId } = await auth()
  if(!userId) {
    return { message: "Unauthorized" }
  }
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
                by : userId
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
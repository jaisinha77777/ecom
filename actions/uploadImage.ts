"use server"
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryResult {
    public_id: string;
    [key: string]: any;
}

export const uploadImage = async (images: File[]) => {
    try {
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            console.log("Cloudinary environment variables are not set.");
            throw new Error("Cloudinary environment variables are not set.");
        }


        const { userId } = await auth()
        if (!userId) {
            throw new Error('Unauthorized')
        }


        const results = await Promise.all(images.map(async (image: File) => {
            const bytes = await image.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const result = await new Promise<CloudinaryResult>((res, rej) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    { folder: 'cloudinary-images' },
                    (error, result) => {
                        if (error) {
                            rej(error)
                        } else {
                            res(result as CloudinaryResult)
                        }
                    }
                )

                upload_stream.end(buffer)

            })
            return result.public_id
        })
        )
        return results
    } catch (error: any) {
        console.log("Error uploading images to Cloudinary:", error);
        throw new Error("Error uploading images to Cloudinary: " + error.message);
    }


}
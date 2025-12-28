"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { productSchema } from "@/schemas/productSchema"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription,
    FieldError,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import {  TrashIcon, UploadIcon } from "lucide-react"
import { uploadProduct } from "@/actions/uploadProduct"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserRole } from "@/hooks/useUserRole"

/* ---------------------------------- */
/* UI Helpers                         */
/* ---------------------------------- */

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        {children}
    </div>
)
const CATEGORIES = [
  { id: 1, label: "Electronics" },
  { id: 2, label: "Clothing & Fashion" },
  { id: 3, label: "Footwear" },
  { id: 4, label: "Home" },
  { id: 5, label: "Furniture" },
  { id: 6, label: "Kitchen" },
  { id: 7, label: "Beauty" },
  { id: 8, label: "Personal Care" },
  { id: 9, label: "Grocery" },
  { id: 10, label: "Health" },
  { id: 11, label: "Sports" },
  { id: 12, label: "Fitness" },
  { id: 13, label: "Books" },
  { id: 14, label: "Stationery" },
  { id: 15, label: "Toys" },
  { id: 16, label: "Baby Products" },
  { id: 17, label: "Automotive" },
  { id: 18, label: "Appliances" },
  { id: 19, label: "Tools" },
  { id: 20, label: "Office Supplies" },
  { id: 21, label: "Jewelry" },
  { id: 22, label: "Watches" },
  { id: 23, label: "Bags & Luggage" },
  { id: 24, label: "Digital Products" },
  { id: 25, label: "Gifts & Seasonal" },
]



const SectionHeader = ({
    title,
    description,
}: {
    title: string
    description?: string
}) => (
    <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
        )}
    </div>
)

/* ---------------------------------- */
/* Page                               */
/* ---------------------------------- */

const UploadProduct = () => {
    const [images, setImages] = useState<File[]>([])
    
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productName: "",
            description: "",
            brand: "",
            category: 1,
            price: 0,
            cost: 0,
            stockQuantity: 0,
            currency: "INR",
        },

    })

    async function onSubmit(data: z.infer<typeof productSchema>) {
        // pass images as formdata
        const formData = new FormData() ;
        if(images.length == 0){
            alert("Please upload at least one image.")
            return
        }
        const res = await uploadProduct(data, images)
        console.log(res)

    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-8">Upload Product</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ---------------------------------- */}
                {/* LEFT SIDE – FORM                   */}
                {/* ---------------------------------- */}
                <div className="lg:col-span-1 space-y-8">
                    <form
                        id="product-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* PRODUCT INFO */}
                        <Card>
                            <SectionHeader
                                title="Product Information"
                                description="Basic details visible to customers"
                            />

                            <FieldGroup>
                                <Controller
                                    name="productName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Product Name</FieldLabel>
                                            <Input {...field} />
                                            <FieldDescription>
                                                This will appear on the product page
                                            </FieldDescription>
                                            {fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="description"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Description</FieldLabel>
                                            <Textarea {...field} rows={4} />
                                            {fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </Card>

                        {/* BRAND & CATEGORY */}
                        <Card>
                            <SectionHeader
                                title="Organization"
                                description="Group and classify the product"
                            />

                            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="brand"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Brand</FieldLabel>
                                            <Input {...field} />
                                        </Field>
                                    )}
                                />

                               <Controller
  name="category"
  control={form.control}
  render={({ field }) => (
    <Field>
      <FieldLabel>Category</FieldLabel>

      <Select
        value={field.value?.toString()}
        onValueChange={(value) => field.onChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>

        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id.toString()}
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )}
/>


                            </FieldGroup>
                        </Card>

                        {/* PRICING */}
                        <Card>
                            <SectionHeader
                                title="Pricing"
                                description="Set selling price and MRP"
                            />

                            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="price"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Price (₹)</FieldLabel>
                                            <Input {...field} type="number" step="0.01" />
                                            {fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="cost"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>MRP (₹)</FieldLabel>
                                            <Input {...field} type="number" step="0.01" />
                                            {fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </Card>

                        {/* INVENTORY */}
                        <Card>
                            <SectionHeader
                                title="Inventory"
                                description="Track available stock"
                            />

                            <FieldGroup>
                                <Controller
                                    name="stockQuantity"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Stock Quantity</FieldLabel>
                                            <Input {...field} type="number" step={1} />
                                            {fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </Card>
                    </form>
                </div>


                <div className="lg:col-span-1">
                    <Card>
                        <SectionHeader
                            title="Product Images"
                            description="Upload high quality images"
                        />

                        <div className="rounded-lg border border-dashed border-input p-6 text-center space-y-4">
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 5MB
                            </p>

                            {/* Hidden input */}
                            <Input
                                id="product-images"
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (!e.target.files) return
                                    setImages((imgs) => [...imgs, ...Array.from(e.target.files!)])
                                }}
                            />

                            {/* Upload button */}
                            <Label
                                htmlFor="product-images"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition
                   hover:bg-accent hover:text-accent-foreground"
                            >
                                <UploadIcon className="h-4 w-4" />
                                Upload Images
                            </Label>
                        </div>

                        {images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((file, i) => (
                                    <div
                                        key={i}
                                        className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm transition hover:shadow-lg"
                                    >
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${i + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            width={300}
                                            height={300}
                                        />

                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setImages((imgs) => imgs.filter((_, idx) => idx !== i))
                                            }
                                            className="absolute top-2 right-2 rounded-full bg-red-500/90 p-2 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>

                                        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">
                                            {i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

            </div>

            {/* ---------------------------------- */}
            {/* STICKY ACTION BAR                  */}
            {/* ---------------------------------- */}
            <div className="sticky bottom-0 mt-10  backdrop-blur p-4 flex justify-end">
                <Button size="lg" form="product-form" type="submit">
                    Save Product
                </Button>
            </div>
        </div>
    )
}

export default UploadProduct

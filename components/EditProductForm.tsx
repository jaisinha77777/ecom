"use client"

import { useForm, Controller } from "react-hook-form"
import { useEffect, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema } from "@/schemas/productSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "./ui/dialog"
import { CATEGORIES } from "./UploadProduct"
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductById, updateProduct } from "@/actions/productActions"
import { TrashIcon } from "lucide-react"

export function EditProductForm({ productId, onClose }: any) {

    // Fetch product details using productId
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProductById(productId),
        enabled: !!productId,
    })
    const [images, setImages] = useState<File[]>([])
    const queryClient = useQueryClient()
    const updateMutation = useMutation({
        mutationFn : updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['products' , productId]
            })
            queryClient.invalidateQueries({
                queryKey: ['dashboard-products']
            })
              queryClient.invalidateQueries({
                queryKey: ['products']
            })
        },
    })
    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productName: "",
            description: "",
            brand: "",
            category: 1,
            price: 1,
            cost: 1,
            stockQuantity: 1,
        }
    })
    useEffect(() => {
        if (product) {
            console.log(form.getValues())
            form.reset({
                productName: product.productName,
                description: product.description,
                brand: product.brand.brandName,
                category: product.categoryId,
                price: product.price,
                cost: product.cost,
                stockQuantity: product.stockQuantity,
            })
            // 
            if (product.images) {
                // images are urls 
                // so make File objects from urls
                const fetchImages = async () => {
                    const files: File[] = []
                    for (const url of product.images) {
                        const res = await fetch(url)
                        const blob = await res.blob()
                        const file = new File([blob], "image.jpg", { type: blob.type })
                        files.push(file)
                    }
                    setImages(files)
                }
                fetchImages()
            }
        }
    }, [product, form])

    if (isLoading) {
        return <div>Loading...</div>
    }

    async function onSubmit(data: any) {
       updateMutation.mutate({
        productId,
        data,
        images
       })
         onClose()
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >

            {/* Product Name */}
            <Controller
                name="productName"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Product Name</FieldLabel>
                        <Input {...field} />

                        {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            {/* Description */}
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
            {/* Brand */}
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
            {/* Category */}
            <Controller
                name="category"
                control={form.control}
                render={({ field }) => (
                    <Field>
                        <FieldLabel>Category</FieldLabel>

                        <Select
                            value={field.value.toString()}
                            onValueChange={(value) => {
                                console.log("Select changed to =", value)
                                field.onChange(Number(value))
                            }}
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

            {/* Price */}
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
                render={({ field }) => (
                    <Field>
                        <FieldLabel>MRP (₹)</FieldLabel>
                        <Input {...field} type="number" step="0.01" />
                    </Field>
                )}
            />

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

            {/* Images */}
            <div>
                <Input
                    type="file"
                    multiple
                    onChange={e =>
                        setImages([...images, ...Array.from(e.target.files ?? [])])
                    }
                />

                <div className="grid grid-cols-3 gap-3 mt-3">
                    {images.map((file, i) => (
                        <div
                                        key={i}
                                        className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm transition hover:shadow-lg"
                                    >
                        <Image
                            key={i}
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            width={200}
                            height={200}
                            className="rounded-md"
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
                            </div>
                    ))}
                  
                </div>
            </div>

            <DialogFooter>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>

                <Button type="submit">
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
    )
}

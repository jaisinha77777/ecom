'use client'

import Image from "next/image"
import { useState } from "react"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { getProductById } from "@/actions/getProducts"
import { useProductActions } from "@/hooks/useProductActions"
import Reviews from "@/components/Reviews"
import StarRating from "@/components/StarRating"

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: product, error, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      // Simulate fetching product data
      return await getProductById(id?.toString() || '');
    }
  })
  const [isNotSaved, setIsNotSaved] = useState(false);
  const { cartMutation, wishlistMutation } = useProductActions({
    productId: id?.toString() || '',
    initialSaved: product?.isSaved ?? false,
    initialInCart: product?.inCart ?? false,
    setSaved: () => { },
    setInCart: () => { },
  })
  const [quantity, setQuantity] = useState<number>(product?.quantity ?? 1);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading product...
      </div>
    )
  }



  if (error || !product) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-red-600">
        Error loading product.
      </div>
    )
  }




  const discount = Math.round(
    ((product.cost - product.price) / product.cost) * 100
  )

  



  const handleBuyNow = () => {
    try {
      if (!product) return;

      // Read existing checkout items (or empty array)

      // Clear existing checkout items
      localStorage.removeItem("checkoutItems");



      // Add current product
      const newItem = {
        id: id,
        name: product.productName,
        price: parseFloat(product.price),
        image: product.images?.[0],
        quantity,
      };

      const updated = [newItem];

      // Save back
      localStorage.setItem("checkoutItems", JSON.stringify(updated));

      // Redirect (optional)
      router.push("/checkout");
    } catch (error) {
      console.log("Error in handleBuyNow :", error);
    }
  };


  return (
    <div className="container mx-auto px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ================= LEFT : IMAGE CAROUSEL ================= */}
        <Card className="p-4 rounded-2xl">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={img}
                      alt={product.productName}
                      fill
                      className="object-contain rounded-xl"

                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Card>

        {/* ================= RIGHT : PRODUCT INFO ================= */}
        <div className="space-y-5">

          {/* Product Name */}
          <h1 className="text-3xl font-bold">{product.productName}</h1>

          {/* Rating Placeholder */}
         


          {/* Pricing */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-600">
              ₹{product.price}
            </span>
            <span className="text-lg line-through text-muted-foreground">
              ₹{product.cost}
            </span>
            <Badge className="bg-green-600 text-white">
              {discount}% OFF
            </Badge>
          </div>

          {/* Stock Warning */}
          {product.stockQuantity <= 10 && (
            <p className="text-red-600 font-medium">
              Only {product.stockQuantity} left in stock
            </p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity</span>
            <Input
              type="number"
              min={1}
              max={product.stockQuantity}
              value={quantity}
              onChange={(e) => {
                setQuantity(Number(e.target.value))
                setIsNotSaved(true);
              }}
              className="w-24"
            />
            {
              quantity > product.stockQuantity && (
                <p className="text-red-600 font-medium">
                  Quantity exceeds available stock.
                </p>
              )
            }
          </div>

          {/* Error */}


          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" disabled={quantity > product.stockQuantity} onClick={handleBuyNow}>
              Buy Now
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" disabled={quantity > product.stockQuantity || (product.inCart && isNotSaved == false)}
                onClick={() => {
                  cartMutation.mutate(quantity);
                  setIsNotSaved(false);
                }}

              >
                {
                  product.inCart && isNotSaved == false ? 'Added to Cart' : 'Add to Cart'
                }
              </Button>

              <Button variant="outline" size="icon"
                onClick={() => {
                  // Toggle saved state
                  wishlistMutation.mutate();
                }}
              >
                {
                  product.isSaved ? <Heart className="fill-red-600 text-red-600" /> : <Heart />
                }
              </Button>
            </div>
          </div>

          {/* ================= REVIEWS SECTION PLACEHOLDER ================= */}
          <div className="pt-8 border-t">
            <h2 className="text-xl font-semibold mb-2">
              Reviews & Ratings
            </h2>
            <div className="text-muted-foreground">
              <Reviews productId={id} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

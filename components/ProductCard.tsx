'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import { addToCart, toggleWishlist } from "@/actions/editCartWishlist";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export default function ProductCard({
  id,
  image,
  name,
  category,
  brand,
  price,
  cost,
  isSaved = false,
  inCart = false,
  stockQuantity = 0
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);
  const [inCartState, setInCartState] = useState(inCart);

  const discount = Math.round(((cost - price) / cost) * 100);

  /* ---------------- Wishlist Mutation ---------------- */
  const wishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(id),
    onMutate: async () => {
      // optimistic update
      setSaved(prev => !prev);
    },
    onError: () => {
      // rollback on error
      setSaved(prev => !prev);
    }
  });

  /* ---------------- Cart Mutation ---------------- */
  const cartMutation = useMutation({
    mutationFn: () => addToCart(id, 1),
    onMutate: async () => {
      setInCartState(true);
    },
    onError: () => {
      setInCartState(false);
    }
  });

  return (
    <Card
      className="w-full p-0 max-w-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow"
      onClick={() => router.push(`/product/${id}`)}
    >
      {/* Product Image */}
     <div className="relative h-64 overflow-hidden rounded-t-2xl bg-muted">
  <Image
    src={image}
    alt={name}
    width={400}
    height={500}
    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
  />

  {discount > 0 && (
    <Badge className="absolute top-3 left-3 bg-green-600 text-white">
      {discount}% OFF
    </Badge>
  )}

  {stockQuantity <= 10 && (
    <Badge className="absolute bottom-3 left-3 bg-red-600 text-white">
      Only {stockQuantity} left in stock
    </Badge>
  )}

  <button
    onClick={(e) => {
      e.stopPropagation();
      wishlistMutation.mutate();
    }}
    disabled={wishlistMutation.isPending}
    className="absolute top-3 right-3 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background"
  >
    <Heart
      className={`h-5 w-5 transition-colors ${
        saved ? "fill-red-500 text-red-500" : "text-muted-foreground"
      }`}
    />
  </button>
</div>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{brand}</span>
          <span>{category}</span>
        </div>

        <h3 className="text-base font-semibold leading-snug line-clamp-2">
          {name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">₹{price}</span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{cost}
          </span>
        </div>

        <Button
          className="w-full mt-2 rounded-xl "
          disabled={inCartState || cartMutation.isPending}
          onClick={(e) => {
            e.stopPropagation();
            cartMutation.mutate();
          }}
        >
          {inCartState ? "Added to Cart" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}

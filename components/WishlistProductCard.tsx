'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { addToCart, toggleWishlist } from "@/actions/editCartWishlist";
import { useQueryClient } from "@tanstack/react-query";
import { useProductActions } from "@/hooks/useProductActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
function WishListProduct({ product }) {
    const [saved, setSaved] = useState(true);
    const [inCart, setInCart] = useState(product.inCart);
    const { wishlistMutation, cartMutation } = useProductActions({
        productId: product.productId,
        initialSaved: product.isSaved,
        initialInCart: product.inCart,
        setSaved,
        setInCart
    });
    const router = useRouter()

    return (
        <div>
            <Card className="rounded-2xl shadow-sm cursor-pointer" onClick={() => router.push(`/product/${product.productId}`)} >
                <CardContent className="p-4 flex gap-4 items-center">
                    <Image
                        src={product.image}
                        alt={product.productName}
                        className="h-20 w-20 rounded-xl object-cover"
                        width={80}
                        height={80}
                    />


                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">{product.productName.length > 50 ? product.productName.substring(0, 50) + "..." : product.productName}</h3>
                        <p className="mt-1 font-medium">₹{product.price}</p>
                        <span className="text-sm text-muted-foreground line-through">
                            ₹{product.cost}
                        </span>
                    </div>


                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async (e) => {
                                e.stopPropagation();
                                cartMutation.mutate();
                            }}
                            disabled={inCart || cartMutation.isPending}
                        >
                            {inCart ? "In Cart" : "Add to Cart"}
                        </Button>


                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={async (e) => {
                                e.stopPropagation();
                                wishlistMutation.mutate();

                            }}
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default WishListProduct

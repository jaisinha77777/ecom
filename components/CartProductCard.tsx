'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductActions } from "@/hooks/useProductActions";
import { Input } from "./ui/input";


export function CartProduct({ item }) {
    const [inCart, setInCart] = useState(true);
    const [notSaved, setNotSaved] = useState(false);
    const [quantity, setQuantity] = useState(item.quantity)
    const router = useRouter()
    const { cartMutation , deleteCartMutation} = useProductActions({
        productId: item.productId,
        initialSaved: false,
        initialInCart: inCart,
        setSaved: () => { },
        setInCart
    });
    return (
        <Card className="rounded-2xl shadow-sm" onClick={() => {
            router.push(`/product/${item.productId}`)
        }}>
            <CardContent className="flex gap-4 p-4">
                <Image
                    src={item.image}
                    alt={item.productName}
                    className="w-24 h-24 rounded-xl object-cover"
                    width={96}
                    height={96}
                />
                <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.productName}</h2>
                    <p className="text-gray-600">₹{item.price}</p>


                    <div className="flex items-center gap-3 mt-3">
                        <Input type={"number"} value={quantity} max={item.stockQuantity} min={1} className="w-16 text-center"
                            onChange={(e) => {
                                setNotSaved(true)
                                setQuantity(e.target.valueAsNumber)
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        />
                        <Button
                            variant="destructive"
                            className=""
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteCartMutation.mutate(item.id) ;
                            }}
                        >
                            Remove from Cart
                        </Button>
                        {
                            notSaved && <Button variant="outline" className=""
                                onClick={ (e) => {
                                    e.stopPropagation()
                                    if(quantity < 1 || quantity > item.stockQuantity) {
                                        alert(`Please enter a quantity between 1 and ${item.stockQuantity}`);
                                        return;
                                    }
                                    cartMutation.mutate(quantity);
                                    setNotSaved(false)
                                }}
                            >
                                Save
                            </Button>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
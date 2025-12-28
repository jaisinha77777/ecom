'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { CartProduct } from "@/components/CartProductCard";
import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/actions/productActions";
import { useRouter } from "next/navigation";

export default function CartPage() {

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartItems
  });

  const router = useRouter();

  /* =================== PROCEED TO BUY =================== */
  const handleBuy = () => {
    try {

      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty");
        return;
      }

      // Normalize format to match checkout page
      const checkoutItems = cartItems.map((item: any) => ({
        id: item.productId,
        name: item.productName ?? item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image ?? item.images?.[0]
      }));

      // clear existing checkout items
      localStorage.removeItem("checkoutItems");

      // Save to localStorage
      localStorage.setItem(
        "checkoutItems",
        JSON.stringify(checkoutItems)
      );

      // Redirect to confirm order page
      router.push("/checkout");

    } catch (err) {
      console.error("Error storing checkout items", err);
    }
  };


  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }


  const totalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );


  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart /> Your Cart
      </h1>


      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: any) => (
              <CartProduct
                key={item.id}
                item={item}
              />
            ))}
          </div>


          {/* ================= SUMMARY ================= */}
          <Card className="rounded-2xl shadow-sm h-fit">
            <CardContent className="p-6">

              <h2 className="text-xl font-semibold mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2">
                <span>Total Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between mb-4 font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>

              <Button
                className="w-full rounded-xl"
                onClick={handleBuy}
              >
                Proceed to Buy
              </Button>

            </CardContent>
          </Card>

        </div>

      )}
    </div>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getUserAddresses } from '@/actions/addAddress';
import { Card, CardContent } from '@/components/ui/card';
import { createOrder } from '@/actions/orderActions';

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export default function ConfirmOrderPage() {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  /* ================= LOAD CHECKOUT ITEMS ================= */
  const [items, setItems] = useState<CheckoutItem[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("checkoutItems") || "[]"
      );
      setItems(stored);
    } catch (e) {
      console.error("Invalid checkoutItems JSON", e);
    }
  }, []);

  /* ================= USER ADDRESS ================= */
  const { data: addressData, isLoading: isAddressLoading } = useQuery({
    queryKey: ['address'],
    queryFn: getUserAddresses,
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const total = subtotal - discount;

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a shipping address");
      return;
    }

    await createOrder({
      addressId: selectedAddressId,
      paymentMethod,
      checkoutItems: items
    });

    
    // TODO: Call backend API here
    localStorage.removeItem("checkoutItems");
    router.push("/dashboard");
  };


  /* ================= BLOCK EMPTY CHECKOUT ================= */
  if (items.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Your checkout is empty.
      </div>
    );
  }


  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= CART ITEMS ================= */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Confirm Your Order
          </h1>

          {items.map((item, idx) => (
            <div
              key={idx}
              className="shadow-sm rounded-2xl p-4 flex gap-4 items-center"
            >
              <Image
                src={item.image ?? '/placeholder.png'}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
                width={80}
                height={80}
              />
              <div className="flex-1">
                <h2 className="font-semibold ">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">
                  ₹ {item.price.toFixed(2)}
                </p>
              </div>
              <span className="font-medium">
                Qty: {item.quantity}
              </span>
            </div>
          ))}

          {/* ================= SHIPPING ADDRESS ================= */}
          <div className="shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isAddressLoading ? (
                <div>Loading addresses...</div>
              ) : addressData && addressData.length > 0 ? (
                <>
                  <Card
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer rounded-2xl border-dashed hover:bg-muted/40 hover:shadow-sm transition-all flex items-center justify-center"
                  >
                    <CardContent className="p-6 text-center">
                      <p className="text-2xl font-bold">+</p>
                      <p className="text-sm mt-1">Add New Address</p>
                    </CardContent>
                  </Card>

                  {addressData.map((addr: any) => {
                    const isSelected = selectedAddressId === addr.address_id;

                    return (
                      <Card
                        key={addr.address_id}
                        onClick={() => setSelectedAddressId(addr.address_id)}
                        className={`
                          cursor-pointer transition-all duration-200 rounded-2xl
                          ${isSelected ? "ring-2" : "hover:shadow-sm hover:bg-muted/40"}
                        `}
                      >
                        <CardContent className="p-4">
                          <p className="font-semibold text-base">{addr.name}</p>

                          <p className="text-sm text-muted-foreground">
                            {addr.address_line1}
                            {addr.address_line2 && `, ${addr.address_line2}`}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {addr.city}
                            {addr.state && `, ${addr.state}`} — {addr.pincode}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </>
              ) : (
                <div>No addresses found. Please add an address.</div>
              )}
            </div>
          </div>

          {/* ================= PAYMENT METHOD ================= */}
          <div className="shadow-sm rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold">Payment Method</h2>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="RazorPay"
                  checked={paymentMethod === 'RazorPay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>RazorPay</span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="space-y-4">
          <div className="shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  - ₹{discount.toFixed(2)}
                </span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button
                onClick={handlePlaceOrder}
                className="w-full"
              >
                Place Order
              </Button>

            </div>
            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

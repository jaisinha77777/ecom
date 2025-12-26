'use client'
import { getOrderById } from '@/actions/orderActions';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const { id } = useParams();
    const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id as string),
  });

  if (isLoading) return <p>Loading order…</p>;
  if (isError || !data) return <p>Failed to load order.</p>;
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">
                Order #{id}
            </h1>

            <p>Status: {data.status}</p>
            <p>Total: ₹ {data.total_amount}</p>
            <p>Payment: {data.payment_method}</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">
                Items
            </h2>

            <div className="space-y-4">
                {data.items.map((item, i) => (
                    <div
                        key={i}
                        className="flex gap-4 border p-3 rounded"
                    >
                        {item.product?.image && (
                            <img
                                src={item.product.image}
                                className="w-16 h-16 object-cover rounded"
                                alt={item.product_name}
                            />
                        )}
                        <div>
                            <p className="font-medium">
                                {item.product_name}
                            </p>
                            <p>Qty: {item.quantity}</p>
                            <p>₹ {item.total_amount}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page

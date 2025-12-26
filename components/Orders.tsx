'use client'
import { getOrdersByUser } from "@/actions/orderActions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function OrdersPage() {
  const {
    data: orders,
    isLoading
  } = useQuery({
    queryKey: ["user-orders"],
    queryFn: getOrdersByUser,
  })

    if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading orders...
      </div>
    );
  }

  // Separate + preserve orderBy created_at desc
  const pending = orders.filter((o: any) => o.status === "pending");
  const completed = orders.filter((o: any) => o.status === "completed");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Your Orders</h1>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-3 text-amber-600">
            Pending Orders
          </h2>
          <div className="space-y-3">
            {pending.map((order: any) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-3 text-emerald-600">
            Completed Orders
          </h2>
          <div className="space-y-3">
            {completed.map((order: any) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <p className="text-gray-500 mt-6">You have no orders yet.</p>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  return (
    <Link href={`/order/${order.order_id}`}>
      <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer my-2">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium">Order #{order.order_id}</p>
         
        </div>

        <p className="text-sm ">
          {new Date(order.created_at).toLocaleString()}
        </p>

        <p className="mt-2 ">
          <span className="font-medium">₹{order.total_amount}</span>
        </p>

        {order.items?.length > 0 && (
          <p className=" text-gray-600 mt-1">
            {order.items.map((i: any) => i.product_name).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}

"use client";

import { getUserReviews } from "@/actions/reviewActions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function YourReviews() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userReviews"],
    queryFn: getUserReviews,
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Could not load reviews.</p>;
  if (!data?.length) return <p>You haven’t reviewed anything yet.</p>;

  return (
    <div className="space-y-4">
      {data.map((review: any) => (
        <div
          key={review.review_id}
          onClick={() => router.push(`/product/${review.product.productId}`)}
          className="cursor-pointer flex items-center gap-4 rounded-xl border p-4 shadow-sm hover:shadow-md transition w-full"
        >
          <Image
            src={review.image}
            alt={review.product.productName}
            width={100}
            height={100}
            className="rounded object-cover aspect-square"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {review.product.productName}
            </h3>

            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {review.review_text}
            </p>

            <div className="mt-2 text-yellow-500">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
2
"use client";

import Fuse from "fuse.js";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/actions/productActions";
import ProductCard from "@/components/ProductCard";
import { SiteHeader } from "@/components/site-header";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/components/providers/ProductsProvider";

export default function SearchPage({  }) {
  const query = useSearchParams().get("q") || "";

  // get ALL or CURRENT CATEGORY products
  const { isLoading,  products } = useProducts() ;

  const fuse = new Fuse(products, {
    includeScore: true,
    threshold: 0.4,
    keys: [
      "productName",
      "description",
      "brand.brandName",
      "category.categoryName",
    ],
  });

  const results = query.length >= 3
    ? fuse.search(query).map(r => r.item)
    : [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <SiteHeader />

      <div className="min-h-screen px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Search results for “{query}”
          </h1>

          <span className="text-sm text-muted-foreground">
            {results.length} items
          </span>
        </div>

        {results.length === 0 ? (
          <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
            No matching products
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map(product => (
              <ProductCard
                key={product.productId}
                id={product.productId}
                image={product.image}
                name={product.productName}
                category={product.category?.categoryName}
                brand={product.brand?.brandName}
                price={product.price}
                cost={product.cost}
                isSaved={product.isSaved}
                inCart={product.inCart}
                stockQuantity={product.stockQuantity}
                source="search"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

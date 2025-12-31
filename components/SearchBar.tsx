"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { useDebounce } from "@uidotdev/usehooks";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createSearchLog } from "@/actions/searchActions";

export default function SearchBar({ products }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [open, setOpen] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        includeScore: true,
        threshold: 0.4,
        keys: [
          "productName",
          "description",
          "brand.brandName",
          "category.categoryName",
        ],
      }),
    [products]
  );

  const mutation = useMutation({
    mutationFn: createSearchLog
  }
  )



  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) return [];
    return fuse.search(debouncedQuery).slice(0, 8).map((r) => r.item);
  }, [debouncedQuery, fuse]);

  function goToSearch() {
    if (query.trim().length >= 2) {
      // Log the search query
      mutation.mutate({ searchQuery: debouncedQuery, clickedProductId: null, searchedProductIds: results.map(r => r.productId) });

      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-start">
          Search products…
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[400px]">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Type to search…"
            onKeyDown={(e) => e.key === "Enter" && goToSearch()}
          />

          <CommandList>
            {results.length === 0 ? (
              <CommandEmpty>No results</CommandEmpty>
            ) : (
              <CommandGroup heading="Products">
                {results.map((product) => (
                  <CommandItem
                    key={product.productId}
                    value={product.productName}
                    onSelect={() => {
                      // Log the search query
                      mutation.mutate({ searchQuery: debouncedQuery, clickedProductId: product.productId });

                      router.push(`/product/${product.productId}?source=search`);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {product.productName}
                      </span>
                      {product.brand?.brandName && (
                        <span className="text-xs text-muted-foreground">
                          {product.brand.brandName}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>

        <div
          className="border-t px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-accent rounded-b-md"
          onClick={goToSearch}
        >
          Search for “{query}”
        </div>
      </PopoverContent>
    </Popover>
  );
}

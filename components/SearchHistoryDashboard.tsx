"use client";

import { useEffect, useState } from "react";
import { deleteSearchQuery, getSearchQueries } from "@/actions/searchActions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  
  const {data , isLoading} = useQuery({
    queryKey: ['searchQueries', page],
    queryFn: () => getSearchQueries(page),
  })

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteSearchQuery,
    onSuccess: ()=>{
      // Refetch the search queries after deletion
     queryClient.invalidateQueries({
        queryKey: ['searchQueries', page]
     });
    }
  })

   function handleDelete(id: number) {
    deleteMutation.mutate(id);
  }

  if (isLoading) return <p>Loading...</p>;

  if(!data || data.items.length === 0) {
    return <p>No search history found.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Your Searches</h1>

      <div className="space-y-2">
        {data.items.map((item: any) => (
          <div
            key={item.queryId}
            className="border rounded-md p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.searchQuery}</p>
              <p className="text-sm text-muted-foreground">
                {item.product?.productName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(item.queryId)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: data.totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={page === pageNum}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPage((p) => Math.min(data.totalPages, p + 1))
              }
              className={
                page === data.totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

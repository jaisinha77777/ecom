"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductsByDealer, updateProductStockAndPrice } from "@/actions/productActions";
import { EditProductForm } from "./EditProductForm";

const stockStatus = (qty: number) => {
  if (qty === 0) return "Out of stock";
  if (qty <= 10) return "Low";
  return "In stock";
};

export default function DealerDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: getProductsByDealer,
  });

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);



  const hasChanges = (p: any) => {
    const org = data.find(o => o.id === p.id);
    if (!org) return false;

    return (
      org.stockQuantity !== p.stockQuantity ||
      org.price !== p.price
    );
  };


  // Filters
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const queryClient = useQueryClient();
  const openEditDialog = (product: any) => setEditing(product);
  const closeEditDialog = () => setEditing(null);
  const simpleUpdateMutation = useMutation({
    mutationFn: updateProductStockAndPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
    },
  })
  // NEW — Uploaded date range
  const [uploadedAfter, setUploadedAfter] = useState("");
  const [uploadedBefore, setUploadedBefore] = useState("");

  const updateProduct = (id: string, updates: Partial<any>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const unique = (key: keyof any) =>
    Array.from(new Set(products?.map((p) => p[key]) ?? []));

  const filtered = useMemo(() => {
    return (
      products?.filter((p) => {
        const created = new Date(p.createdAt);

        const matchesCategory = !category || p.category === category;
        const matchesBrand = !brand || p.brand === brand;
        const matchesStatus = !status || stockStatus(p.stockQuantity) === status;
        const matchesMin = !minPrice || p.price >= Number(minPrice);
        const matchesMax = !maxPrice || p.price <= Number(maxPrice);
        const matchesAfter =
          !uploadedAfter || created >= new Date(uploadedAfter);

        const matchesBefore =
          !uploadedBefore || created <= new Date(uploadedBefore);

        return (
          matchesCategory &&
          matchesBrand &&
          matchesStatus &&
          matchesMin &&
          matchesMax &&
          matchesAfter &&
          matchesBefore
        );
      }) ?? []
    );
  }, [
    products,
    category,
    brand,
    status,
    minPrice,
    maxPrice,
    uploadedAfter,
    uploadedBefore,
  ]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>Loading...</CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="text-red-500">
            Failed to load products.
          </CardContent>
        </Card>
      </div>
    );
  }
  const handleSave = async(productId: string) => {
    simpleUpdateMutation.mutate({
      productId,
      stockQuantity: products.find(p => p.id === productId)?.stockQuantity,
      price: products.find(p => p.id === productId)?.price,
    });
    
    


  }
  return (
    <div className="p-8 space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Category */}
            <Select
              value={category || "all"}
              onValueChange={(v) => setCategory(v === "all" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {unique("category").map((c) => (
                  <SelectItem key={String(c)} value={String(c)}>
                    {String(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Brand */}
            <Select
              value={brand || "all"}
              onValueChange={(v) => setBrand(v === "all" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {unique("brand").map((b) => (
                  <SelectItem key={String(b)} value={String(b)}>
                    {String(b)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Stock Status */}
            <Select
              value={status || "all"}
              onValueChange={(v) => setStatus(v === "all" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="In stock">In stock</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Out of stock">Out of stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Min Price */}
            <Input
              type="number"
              placeholder="Min Price"
              min={0}
              step={0.01}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            {/* Max Price */}
            <Input
              type="number"
              min={minPrice ? Number(minPrice) : 0}
              step={0.01}
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            {/* Uploaded After */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

              {/* ...existing dropdown & price inputs... */}

              {/* Uploaded After */}
              <div className="md:col-span-5 space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Uploaded After
                </label>
                <Input
                  type="date"
                  value={uploadedAfter}
                  onChange={(e) => setUploadedAfter(e.target.value)}
                />
              </div>

              {/* Uploaded Before */}
              <div className="md:col-span-5 space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Uploaded Before
                </label>
                <Input
                  type="date"
                  value={uploadedBefore}
                  onChange={(e) => setUploadedBefore(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Uploaded On</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link
                      href={`/product/${p.id}`}
                      className="text-primary hover:underline"
                    >
                      {p.name.length > 30
                        ? p.name.substring(0, 27) + "..."
                        : p.name}
                    </Link>
                  </TableCell>

                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.brand}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        p.stockQuantity === 0
                          ? "destructive"
                          : p.stockQuantity <= 10
                            ? "secondary"
                            : "default"
                      }
                    >
                      {stockStatus(p.stockQuantity)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      className="w-20"
                      min={0}
                      value={p.stockQuantity}
                      onChange={(e) =>
                        updateProduct(p.id, {
                          stockQuantity: Number(e.target.value),
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      className="w-24"
                      min={0}
                      step={0.01}
                      value={p.price}
                      onChange={(e) =>
                        updateProduct(p.id, {
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {hasChanges(p) && (
                      <Button size="sm" onClick={() => {
                        handleSave(p.id)
                      }}>
                        Save
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditDialog(p)}
                    >
                      Edit
                    </Button>
                  </TableCell>


                  {/* NEW COLUMN */}
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {editing && (
            <Dialog open onOpenChange={closeEditDialog}>
              <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>

                <EditProductForm productId={editing.id} onClose={closeEditDialog} />
              </DialogContent>
            </Dialog>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

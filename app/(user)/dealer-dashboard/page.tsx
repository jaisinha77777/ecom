'use client'
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import UploadProduct from "../upload-product/page";
import { BulkUpload } from "@/components/BulkUpload";

// Dummy data for the mini chart
const revenueData = [
  { name: "Mon", revenue: 3400 },
  { name: "Tue", revenue: 2800 },
  { name: "Wed", revenue: 4200 },
  { name: "Thu", revenue: 3900 },
  { name: "Fri", revenue: 4600 },
  { name: "Sat", revenue: 5100 },
  { name: "Sun", revenue: 4800 },
];

export default function DealerDashboard() {
  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Dealer Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your products, inventory, and orders in one place.</p>
        </header>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="pt-6">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-5 rounded-2xl">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="add">Add New Product</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Upload / CSV Import</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="orders">Orders & Sales</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="pt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Low-Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">15</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Out-of-Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">6</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">28</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Units Sold</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">1,254</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <Card className="rounded-2xl lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 w-full">
                        <ResponsiveContainer>
                          <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Bestselling Products</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Product A</span>
                        <span className="font-medium">342 units</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Product B</span>
                        <span className="font-medium">298 units</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Product C</span>
                        <span className="font-medium">251 units</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Add Product */}
              <TabsContent value="add" className="pt-6">
                <UploadProduct />
              </TabsContent>

              {/* Bulk Upload */}
              <TabsContent value="bulk" className="pt-6">
                <BulkUpload />
              </TabsContent>

              {/* Inventory */}
              <TabsContent value="inventory" className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Low-Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">15</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Out-of-Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">6</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Orders & Sales */}
              <TabsContent value="orders" className="pt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">Total Sales Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$2,540</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$12,380</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$48,920</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

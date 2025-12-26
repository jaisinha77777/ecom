"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AddAddressForm } from "./AddAddressForm";
import { AddressesList } from "./AddressList";
import Link from "next/link";
import OrdersPage from "./Orders";

export default function DashboardPage() {
  const [phone, setPhone] = useState("");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
        <p className="text-muted-foreground">
          View your activity, track orders, and manage your account
        </p>
      </header>

      <Separator />

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="search">Search History</TabsTrigger>
          <TabsTrigger value="viewed">Products Viewed</TabsTrigger>
          <TabsTrigger value="reviews">Your Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ORDERS */}
        <TabsContent value="orders">
            <OrdersPage />
        </TabsContent>

        {/* ADDRESSES */}
        {/* ADDRESSES */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
              <CardDescription>
                Manage your shipping and billing addresses
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* FETCH */}
              <AddressesList />

              {/* Add form */}
              <AddAddressForm />

            </CardContent>
          </Card>
        </TabsContent>


        {/* SEARCH */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search History</CardTitle>
              <CardDescription>
                Your recent searches and viewed categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No search history yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIEWED */}
        <TabsContent value="viewed">
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nothing viewed yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REVIEWS */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You haven’t submitted any reviews yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS */}
        <TabsContent value="settings">
          <div className="space-y-6">

            {/* PHONE */}
            <Card>
              <CardHeader>
                <CardTitle>Phone Number</CardTitle>
                <CardDescription>
                  Update the phone number linked to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 555-000-1234"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button>Save changes</Button>
              </CardContent>
            </Card>

            {/* HISTORY */}
            <Card>
              <CardHeader>
                <CardTitle>Activity & History</CardTitle>
                <CardDescription>
                  Control how your browsing and search data is stored
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full md:w-auto">
                  Clear search history
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  Clear viewed products
                </Button>
              </CardContent>
            </Card>

            {/* DATA */}
            <Card>
              <CardHeader>
                <CardTitle>Your Data</CardTitle>
                <CardDescription>
                  Download a copy of your account data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full md:w-auto">
                  Download my data
                </Button>
              </CardContent>
            </Card>

            {/* PASSWORD */}
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>
                  Keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full md:w-auto">
                  Reset password
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

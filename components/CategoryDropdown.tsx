"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useCategory } from "./providers/CategoriesProvider"

const categories = [
  "Electronics",
  "Clothing & Fashion",
  "Footwear",
  "Home",
  "Furniture",
  "Kitchen",
  "Beauty",
  "Personal Care",
  "Grocery",
  "Health",
  "Sports",
  "Fitness",
  "Books",
  "Stationery",
  "Toys",
  "Baby Products",
  "Automotive",
  "Appliances",
  "Tools",
  "Office Supplies",
  "Jewelry",
  "Watches",
  "Bags & Luggage",
  "Digital Products",
  "Gifts & Seasonal",
]

export function CategoriesDropdown() {
  const {category, setCategory} = useCategory() 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {category}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 max-h-72 overflow-y-auto">
        <DropdownMenuItem
          onClick={() => setCategory("All Categories")}
        >
          All Categories
        </DropdownMenuItem>

        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => setCategory(category)}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

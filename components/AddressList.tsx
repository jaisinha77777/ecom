"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Edit2 } from "lucide-react"
import { getUserAddresses, deleteAddress } from "@/actions/addAddress"
import { EditAddressDialog } from "./EditAddressDialog"
import { useAddressActions } from "@/hooks/useAddressActions"
import AddressCard from "./AddressCard"

type Address = {
  id: string
  name: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  pincode: string
  isDefault?: boolean
}

export function AddressesList() {

  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getUserAddresses,
  })

  

  /* ---------------- */
  /* LOADING SKELETON */
  /* ---------------- */
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6 space-y-3 animate-pulse">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    )
  }

  /* ---------------- */
  /* EMPTY STATE      */
  /* ---------------- */
  if (!data || data.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven’t added any addresses yet.
      </p>
    )
  }

  /* ---------------- */
  /* ADDRESS CARDS    */
  /* ---------------- */
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((addr) => (
        <AddressCard key={addr.address_id.toString()} addr={addr} />
      ))}
    </div>
  )
}

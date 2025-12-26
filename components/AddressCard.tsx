import React from 'react'
import { EditAddressDialog } from './EditAddressDialog'
import { Trash2 } from 'lucide-react'
import { Card } from './ui/card'
import { useAddressActions } from '@/hooks/useAddressActions'

const AddressCard = ({addr}) => {
    const { deleteMutation } = useAddressActions({ addressId: addr.address_id.toString() });
  return (
    <Card
          key={addr.address_id}
          className="p-6 hover:shadow-lg transition-shadow relative"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-medium text-lg">{addr.name}</p>
             
              <p className="text-sm text-muted-foreground">
                {addr.address_line1}
                {addr.address_line2 && `, ${addr.address_line2}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {addr.city}
                {addr.state && `, ${addr.state}`} - {addr.pincode}
              </p>
            </div>

            <div className="flex gap-2">
            
               <EditAddressDialog address={addr}   />
              <button
                type="button"
                className="p-2 rounded-md hover:bg-red-100 transition"
                onClick={() => deleteMutation.mutate(addr.address_id.toString())}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        </Card>
  )
}

export default AddressCard

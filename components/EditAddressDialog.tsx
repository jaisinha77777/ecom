"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { UserAddressSchema } from "@/schemas/addressSchema"
import { useAddressActions } from "@/hooks/useAddressActions"

type AddressFormValues = z.infer<typeof UserAddressSchema>

export function EditAddressDialog({
  address
}: {
  address: AddressFormValues & { address_id: bigint },
}) {
  const [open, setOpen] = useState(false)
  const {updateMutation} = useAddressActions({addressId : address.address_id.toString()}) ;
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(UserAddressSchema),
    defaultValues: {
      name: address.name,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },
  })

  // Reset form when dialog opens with new data
  useEffect(() => {
    form.reset({
      name: address.name,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    })
  }, [address, open])

  function handleSubmit(data: AddressFormValues) {
    updateMutation.mutate(data);
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Edit Address</DialogTitle>
        <DialogDescription>Edit your saved address details below.</DialogDescription>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input {...field} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="address_line1"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address Line 1</FieldLabel>
                  <Input {...field} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="address_line2"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Address Line 2 (optional)</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>City</FieldLabel>
                    <Input {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="state"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>State (optional)</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />

              <Controller
                name="pincode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Pincode</FieldLabel>
                    <Input {...field} maxLength={6} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <div className="flex justify-end gap-2 mt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { UserAddressSchema } from "@/schemas/addressSchema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addAddress } from "@/actions/addAddress"

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        {children}
    </div>
)

const SectionHeader = ({
    title,
    description,
}: {
    title: string
    description?: string
}) => (
    <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
        )}
    </div>
)

type AddressFormValues = z.infer<typeof UserAddressSchema>

export function AddAddressForm() {
    const [open, setOpen] = useState(false)
    const queryClient =  useQueryClient() ;
    const mutation = useMutation({
        mutationFn: (data : any) => addAddress(data), // server action
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['addresses']
            })
        },
    })
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(UserAddressSchema),
        defaultValues: {
            name: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            pincode: "",
        },
    })

    async function onSubmit(data: AddressFormValues) {
        console.log("Submitting address:", data)

        // TODO: call backend here
        mutation.mutate(data) ;
        form.reset()
        setOpen(false)
    }

    if (!open) {
        return (
            <Button onClick={() => setOpen(true)}>
                Add new address
            </Button>
        )
    }

    return (
        <Card>
            <SectionHeader
                title="Add New Address"
                description="Enter your shipping address details"
            />

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FieldGroup>

                    {/* Name */}
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Full Name</FieldLabel>
                                <Input {...field} placeholder="John Doe" />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Address Line 1 */}
                    <Controller
                        name="address_line1"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Address Line 1</FieldLabel>
                                <Input {...field} placeholder="House / Flat / Street" />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Address Line 2 */}
                    <Controller
                        name="address_line2"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Address Line 2 (optional)</FieldLabel>
                                <Input {...field} placeholder="Apartment / Landmark" />
                            </Field>
                        )}
                    />

                    {/* City / State / Pincode */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <Controller
                            name="city"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>City</FieldLabel>
                                    <Input {...field} />
                                    {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
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
                                    <Input
                                        {...field}
                                        inputMode="numeric"
                                        maxLength={6}
                                    />
                                    {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                    </div>
                </FieldGroup>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button type="submit">
                        Save Address
                    </Button>
                </div>
            </form>
        </Card>
    )
}

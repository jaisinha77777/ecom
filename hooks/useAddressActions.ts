'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, deleteFromCart, toggleWishlist } from "@/actions/editCartWishlist";
import { deleteAddress, updateAddress } from "@/actions/addAddress";

export function useAddressActions({
    addressId
}: {
    addressId: string;
}) {
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: () => deleteAddress(addressId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    })
    const updateMutation = useMutation({
        mutationFn: (data: any) => updateAddress(addressId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    })

    return {
        deleteMutation,
        updateMutation
    };
}


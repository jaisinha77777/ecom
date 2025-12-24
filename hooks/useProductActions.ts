'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, deleteFromCart, toggleWishlist } from "@/actions/editCartWishlist";

export function useProductActions({
    productId,
    initialSaved,
    initialInCart,
    setSaved,
    setInCart
}: {
    productId: string;
    initialSaved: boolean;
    initialInCart: boolean;
    setSaved: (v: boolean | ((p: boolean) => boolean)) => void;
    setInCart: (v: boolean | ((p: boolean) => boolean)) => void;
}) {
    const queryClient = useQueryClient();
    const wishlistMutation = useMutation({
        mutationFn: () => toggleWishlist(productId),
        onMutate: async () => {
            setSaved(prev => !prev);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
        },

        onError: () => {
            setSaved(prev => !prev);
        },

    });

    const cartMutation = useMutation({
        mutationFn: (addQuantity: number = 1) => addToCart(productId, addQuantity),
        onMutate: () => {
            setInCart(true);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
        },

        onError: () => {
            setInCart(false);
        }
    });

    const deleteCartMutation = useMutation({
        mutationFn: (id: string) => deleteFromCart(id),
        onMutate: () => {
            setInCart(false);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: () => {
            setInCart(true);
        }

    });


    return {
        wishlistMutation,
        cartMutation,
        deleteCartMutation
    };
}

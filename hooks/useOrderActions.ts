'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useOrderActions({
    orderId
}: {
    orderId: string;
}) {
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: () => deleteOrder(orderId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    })
    const updateMutation = useMutation({
        mutationFn: (data: any) => updateOrder(orderId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    })

    return {
        deleteMutation,
        updateMutation
    };
}


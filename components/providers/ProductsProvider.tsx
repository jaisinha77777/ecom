'use client'
import { getProductsByCategory } from '@/actions/productActions'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useState } from 'react'
import { useCategory } from './CategoriesProvider'


const productsContext = createContext({
    products : [] as any[],
    isLoading: true ,
})

export const ProductsProvider = ({ children}: { children: React.ReactNode }) => {
    const { category, setCategory } = useCategory();

    const { isLoading, data: products } = useQuery({
        queryKey: ['products', category],
        queryFn: async () => {
            return getProductsByCategory(category)
        }
    })
    return (
        <productsContext.Provider value={{ products, isLoading}}>
            {children}
        </productsContext.Provider>
    )
}

export const useProducts = () => useContext(productsContext)
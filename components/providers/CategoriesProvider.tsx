'use client'
import { createContext, useContext, useState } from 'react'


const categoryContext = createContext({
    category: "All Categories",
    setCategory: (category: string) => { }
})

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
    const [category, setCategory] = useState("All Categories")
    return (
        <categoryContext.Provider value={{ category, setCategory }}>
            {children}
        </categoryContext.Provider>
    )
}

export const useCategory = () => useContext(categoryContext)
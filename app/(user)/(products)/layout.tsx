
import { CategoriesProvider } from "@/components/providers/CategoriesProvider"
import { ProductsProvider } from "@/components/providers/ProductsProvider"

export default function Page({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <ProductsProvider>
                {children}
            </ProductsProvider>
        </>
    )
}

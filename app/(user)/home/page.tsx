'use client'
import { getProductsByCategory } from '@/actions/productActions'
import ProductCard from '@/components/ProductCard'
import { useCategory } from '@/components/providers/CategoriesProvider'
import { useQuery } from '@tanstack/react-query'

const page = () => {
    const { category, setCategory } = useCategory();

    // on Change of category fetch products of that category
    const { isLoading, data: products } = useQuery({
        queryKey: ['products', category],
        queryFn: async () => {
            return await getProductsByCategory(category) || []
        }
    })

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                Loading...
            </div>
        )
    }

    console.log("Products fetched:", products);

    return (
        <div className="min-h-screen px-6 py-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">All Products</h1>
                <span className="text-sm text-muted-foreground">
                    {products.length} items
                </span>
            </div>

            {(!products || products.length === 0) ? (
                <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
                    No products available
                </div>
            ) :
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            id={product.productId}
                            key={product.productId}
                            image={product.image}
                            name={product.productName}
                            category={product.category?.categoryName}
                            brand={product.brand?.brandName}
                            price={product.price}
                            cost={product.cost}
                            isSaved={product.isSaved}
                            inCart={product.inCart}
                            stockQuantity={product.stockQuantity}
                        />
                    ))}
                </div>


            }

        </div>
    )
}

export default page

'use client'
import ProductCard from '@/components/ProductCard'
import { useCategory } from '@/components/providers/CategoriesProvider'
import { useProducts } from '@/components/providers/ProductsProvider'
import { SiteHeader } from '@/components/site-header'
import { useRecommendations } from '@/hooks/useRecommendations'

const page = () => {

    // on Change of category fetch products of that category
    const { isLoading,  products } = useProducts()
    const {category} = useCategory()
    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                Loading...
            </div>
        )
    }

    console.log("Products fetched:", products);

    return (
        <>
                <SiteHeader />

                <div className="min-h-screen px-6 py-8">
                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <div className="mb-12">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Recommended for You</h2>
                                <span className="text-sm text-muted-foreground">
                                    Based on your searches and reviews
                                </span>
                            </div>
                            {recLoading ? (
                                <div className="flex h-[30vh] items-center justify-center">
                                    Loading recommendations...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {recommendations.map((product) => (
                                        <ProductCard
                                            id={product.productId}
                                            key={product.productId}
                                            image={product.images?.[0] || '/placeholder.jpg'}
                                            name={product.productName}
                                            category={product.category?.categoryName}
                                            brand={product.brand?.brandName}
                                            price={product.price}
                                            cost={product.cost}
                                            isSaved={false} // We'll need to check this
                                            inCart={false} // We'll need to check this
                                            stockQuantity={product.stockQuantity}
                                            source="home"
                                            filterCategory={category}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

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
                                    source="home"
                                    filterCategory={category}
                                />
                            ))}
                        </div>


                    }

                </div>
          
        </>
    )
}

export default page

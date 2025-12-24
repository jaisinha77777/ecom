'use client'
import { getWishList } from '@/actions/getProducts';
import WishListProduct from '@/components/WishlistProductCard';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';

const page = () => {
    
    const {data : wishlist ,  isLoading} = useQuery({
        queryKey: ['wishlist'],
        queryFn: getWishList
    })

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                Loading...
            </div>
        )
    }
    console.log("Wishlist fetched:", wishlist);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Heart className="h-6 w-6 " />
                <h1 className="text-2xl font-bold">My Wishlist</h1>
            </div>


            {wishlist.length === 0 ? (
                <p className="text-muted-foreground">Your wishlist is empty.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {wishlist.map((product) => (
                        <WishListProduct
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default page

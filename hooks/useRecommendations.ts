'use client'
import { useQuery } from "@tanstack/react-query";
import { getUserDataForRecommendations, getAllProductsForSimilarity } from "@/actions/recommendationActions";

// Simple cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return normA && normB ? dotProduct / (normA * normB) : 0;
}

// Create vector representation of a product
function createProductVector(product: any, allCategories: string[], allTags: string[]): number[] {
    const categoryIndex = allCategories.indexOf(product.category?.categoryName || '');
    const tagIndices = product.tags.map((tag: string) => allTags.indexOf(tag));

    const vector = new Array(allCategories.length + allTags.length).fill(0);
    if (categoryIndex >= 0) vector[categoryIndex] = 1;
    tagIndices.forEach((index: number) => {
        if (index >= 0) vector[allCategories.length + index] = 1;
    });

    return vector;
}

export function useRecommendations(limit: number = 10) {
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['userDataForRecommendations'],
        queryFn: getUserDataForRecommendations,
    });

    const { data: allProducts, isLoading: productsLoading } = useQuery({
        queryKey: ['allProductsForSimilarity'],
        queryFn: getAllProductsForSimilarity,
    });

    const recommendations = useMemo(() => {
        if (!userData || !allProducts) return [];

        // Extract all unique categories and tags
        const allCategories = [...new Set(allProducts.map(p => p.category?.categoryName).filter(Boolean))];
        const allTags = [...new Set(allProducts.flatMap(p => p.tags))];

        // Get user's interacted products
        const userProducts = new Set([
            ...userData.searches.flatMap(s => [
                s.product?.productId,
                ...s.searchedProducts.map(sp => sp.product.productId)
            ].filter(Boolean)),
            ...userData.reviews.map(r => r.product.productId),
            ...userData.interactions.map(i => i.product.productId),
            ...userData.views.map(v => v.product.productId),
        ].filter(Boolean));

        // Calculate product scores
        const productScores: { [key: string]: number } = {};

        // Content-based filtering: similarity to user's products
        userProducts.forEach(userProductId => {
            const userProduct = allProducts.find(p => p.productId === userProductId);
            if (!userProduct) return;

            const userVector = createProductVector(userProduct, allCategories, allTags);

            allProducts.forEach(product => {
                if (userProducts.has(product.productId)) return; // Don't recommend already interacted products

                const productVector = createProductVector(product, allCategories, allTags);
                const similarity = cosineSimilarity(userVector, productVector);

                productScores[product.productId] = (productScores[product.productId] || 0) + similarity;
            });
        });

        // Collaborative filtering: boost products based on interaction types
        userData.interactions.forEach(interaction => {
            const boost = interaction.interactionType === 'purchase' ? 2 :
                         interaction.interactionType === 'add_to_wishlist' ? 1.5 :
                         interaction.interactionType === 'review' ? 1.2 : 1;
            productScores[interaction.product.productId] = (productScores[interaction.product.productId] || 0) + boost;
        });

        // Boost based on review ratings
        userData.reviews.forEach(review => {
            const boost = review.rating >= 4 ? 1.5 : review.rating >= 3 ? 1 : 0.5;
            productScores[review.product.productId] = (productScores[review.product.productId] || 0) + boost;
        });

        // Sort and limit recommendations
        const sortedRecommendations = Object.entries(productScores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([productId]) => allProducts.find(p => p.productId === productId))
            .filter(Boolean);

        return sortedRecommendations;
    }, [userData, allProducts, limit]);

    return {
        recommendations,
        isLoading: userLoading || productsLoading,
    };
}

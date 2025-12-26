"use client";

import { useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReview, deleteReview, getMyReviewForProduct, getReviewsByProductId } from "@/actions/reviewActions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import StarRating from "./StarRating";

type Review = {
    id: string;
    rating: number;
    review_text?: string | null;
    title?: string | null;
    created_at: string;
    user_id: string;
};

export default function Reviews({ productId }: { productId: string }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            queryClient.invalidateQueries({ queryKey: ['myReview', productId] });
            setSubmitting(false);
            setDialogOpen(false);
        }
    });

    // form state
    const [rating, setRating] = useState<number>(1);
    const [title, setTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [hover, setHover] = useState(0);

    // dialog + mode state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const { data: reviews, isLoading: loading } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => getReviewsByProductId(productId)
    });

    const { data: myReview, isLoading: loadingMyReview } = useQuery({
        queryKey: ['myReview', productId],
        queryFn: () => getMyReviewForProduct(productId)
    });

    const deleteMutation = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            queryClient.invalidateQueries({ queryKey: ['myReview', productId] });
        }
    });

    // Calculate average rating including my review
    const avgRating = useMemo(() => {
        return reviews && reviews.length > 0
            ? (reviews.reduce((acc, review) => acc + review.rating, 0) + (myReview ? myReview.rating : 0)) / (reviews.length + (myReview ? 1 : 0))
            : myReview
                ? myReview.rating
                : 0;
    }, [reviews, myReview])

    // ---------- Edit / Delete ----------
    function handleEdit() {
        if (!myReview) return;

        setIsEditing(true);
        setDialogOpen(true);

        setRating(myReview.rating);
        setTitle(myReview.title ?? "");
        setReviewText(myReview.review_text ?? "");
    }

    function handleDelete() {
        if (!myReview) return;

        deleteMutation.mutate(myReview.review_id);
    }

    // ---------- Submit ----------
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setSubmitting(true);

            // currently always create - update later if needed
            mutation.mutate({
                rating,
                review_text: reviewText,
                productId,
                title,
            });

        } catch (error) {
            console.error("Failed to submit review:", error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-muted-foreground">
                Overall Rating      <StarRating rating={avgRating ?? 0} />
            </div>
            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                {!myReview && (
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                setRating(1);
                                setTitle("");
                                setReviewText("");
                            }}
                        >
                            Add review
                        </Button>
                    </DialogTrigger>
                )}

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Edit your review" : "Write a review"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Rating</label>

                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="p-1"
                                    >
                                        <Star
                                            className={
                                                star <= (hover || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-400"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                {rating} out of 5
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Great product!"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Review</label>
                            <Textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your experience..."
                            />
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full">
                            {submitting
                                ? "Submitting..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Submit Review"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* My Review */}
            {myReview && !loadingMyReview ? (
                <div
                    key={myReview.review_id}
                    className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <span className="text-sm font-medium">
                                    {myReview.user?.name?.[0]?.toUpperCase() || "A"}
                                </span>
                            </div>

                            <div>
                                <p className="font-semibold leading-none">
                                    {myReview.user?.name || "Anonymous"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(myReview.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={handleEdit}>
                                Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-base font-medium">
                            {myReview.title || "Untitled"}
                        </p>

                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={`h-4 w-4 ${star <= myReview.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279L0 9.306l8.332-1.151z" />
                                </svg>
                            ))}
                        </div>
                    </div>

                    {myReview.review_text && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {myReview.review_text}
                        </p>
                    )}
                </div>
            ) : null}

            {/* All Reviews */}
            {loading ? (
                <p>Loading...</p>
            ) : (!reviews || reviews.length === 0) ? (
                <p className="text-muted-foreground">No other reviews yet.</p>
            ) : (
                <div className="space-y-4">
                    {reviews!.map((review) => (
                        <div
                            key={review.review_id}
                            className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    <span className="text-sm font-medium">
                                        {review.user?.name?.[0]?.toUpperCase() || "A"}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-semibold leading-none">
                                        {review.user?.name || "Anonymous"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-base font-medium">
                                    {review.title || "Untitled"}
                                </p>

                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className={`h-4 w-4 ${star <= review.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted-foreground"
                                                }`}
                                        >
                                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279L0 9.306l8.332-1.151z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>

                            {review.review_text && (
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    {review.review_text}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import React, { useState } from 'react';
import { useReviews, useCanReview, useCreateReview } from '../../hooks/queries/useReviews';
import { useAuth } from '../../context/AuthContext';
import { Star, User } from 'lucide-react';

const ProductReviews = ({ productId }) => {
    const { user } = useAuth();
    const { data: reviewsData, isLoading } = useReviews(productId);
    const { data: canReviewData } = useCanReview(productId, user?.id);
    const { mutate: createReview, isPending } = useCreateReview();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [showForm, setShowForm] = useState(false);

    const reviews = reviewsData?.reviews || [];
    const averageRating = reviewsData?.averageRating || 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        createReview(
            { productId, rating, comment },
            {
                onSuccess: () => {
                    setShowForm(false);
                    setComment('');
                    setRating(5);
                }
            }
        );
    };

    if (isLoading) return <div className="py-8 text-center text-gray-500">Loading reviews...</div>;

    return (
        <div className="mt-16 pt-16 border-t border-gray-100">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-serif mb-2">Customer Reviews</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={18}
                                        fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                        strokeWidth={1.5}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                {averageRating.toFixed(1)} based on {reviews.length} reviews
                            </span>
                        </div>
                    </div>

                    {canReviewData?.canReview && !showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Write a Review
                        </button>
                    ) : user && !canReviewData?.canReview ? (
                        <div className="text-sm text-gray-500 italic bg-gray-50 px-4 py-2 rounded-lg">
                            {canReviewData?.hasReviewed
                                ? "You have already reviewed this product."
                                : "Only verified purchasers can write reviews."}
                        </div>
                    ) : null}
                </div>

                {/* Review Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-lg font-medium mb-4">Write your review</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`transition-colors ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                    >
                                        <Star size={24} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors"
                                placeholder="Share your experience with this product..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-50"
                            >
                                {isPending ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Reviews List */}
                <div className="space-y-8">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">{review.user.name}</h4>
                                            <div className="flex text-yellow-500 text-xs mt-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={12}
                                                        fill={star <= review.rating ? "currentColor" : "none"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed pl-[52px]">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            No reviews yet. Be the first to review!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;

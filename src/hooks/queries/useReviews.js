import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import toast from 'react-hot-toast';

// Get Reviews
const fetchReviews = async (productId) => {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return data;
};

// Check if user can review
const checkCanReview = async (productId) => {
    const { data } = await api.get(`/reviews/can-review/${productId}`);
    return data;
};

// Create Review
const createReview = async ({ productId, rating, comment }) => {
    const { data } = await api.post(`/reviews/product/${productId}`, { rating, comment });
    return data;
};

export const useReviews = (productId) => {
    return useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => fetchReviews(productId),
        enabled: !!productId,
    });
};

export const useCanReview = (productId, userId) => {
    return useQuery({
        queryKey: ['canReview', productId, userId],
        queryFn: () => checkCanReview(productId),
        enabled: !!productId && !!userId,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createReview,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
            queryClient.invalidateQueries({ queryKey: ['canReview', variables.productId] });
            toast.success('Review submitted successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        },
    });
};

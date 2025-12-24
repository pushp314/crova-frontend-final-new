import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import toast from 'react-hot-toast';

// Fetch Wishlist
const fetchWishlist = async () => {
    const { data } = await api.get('/wishlist');
    return data;
};

// Add Item
const addToWishlist = async ({ productId }) => {
    const { data } = await api.post('/wishlist/add', { productId });
    return data;
};

// Remove Item
const removeFromWishlist = async (productId) => {
    const { data } = await api.delete(`/wishlist/remove/${productId}`);
    return data;
};

export const useWishlist = (options = {}) => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: fetchWishlist,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Added to wishlist');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
        },
    });
};

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Removed from wishlist');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
        },
    });
};

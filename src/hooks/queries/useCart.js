import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import toast from 'react-hot-toast';

const QUERY_KEYS = {
    CART: ['cart'],
};

// Fetch cart
export const useCart = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.CART,
        queryFn: async () => {
            const { data } = await api.get('/cart');
            return data;
        },
        staleTime: 1000 * 60, // 1 minute stale time for cart
        ...options,
    });
};

// Add to cart
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ variantId, quantity }) => {
            const { data } = await api.post('/cart/add', { variantId, quantity });
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEYS.CART, data);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
            toast.success('Added to cart');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        },
    });
};

// Update cart item
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ variantId, quantity }) => {
            const { data } = await api.put('/cart/update', { variantId, quantity });
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEYS.CART, data);
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART }); // Optional if setting data directly
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update cart');
        },
    });
};

// Remove from cart
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (variantId) => {
            const { data } = await api.delete(`/cart/remove/${variantId}`);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEYS.CART, data);
            toast.success('Removed from cart');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to remove from cart');
        },
    });
};

// Clear cart
export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.delete('/cart/clear');
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEYS.CART, data);
            toast.success('Cart cleared');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to clear cart');
        },
    });
};

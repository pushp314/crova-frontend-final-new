import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

// Fetch all products
export const useProducts = (params = {}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const { data } = await api.get('/products', { params });
            return data;
        },
        keepPreviousData: true,
    });
};

// Fetch single product
export const useProduct = (slugOrId) => {
    return useQuery({
        queryKey: ['products', slugOrId],
        queryFn: async () => {
            const { data } = await api.get(`/products/${slugOrId}`);
            return data;
        },
        enabled: !!slugOrId,
    });
};

// Featured products
export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: async () => {
            const { data } = await api.get('/products/featured');
            return data;
        },
    });
};

// Search products
export const useSearchProducts = (query) => {
    return useQuery({
        queryKey: ['products', 'search', query],
        queryFn: async () => {
            const { data } = await api.get('/products/search', { params: { q: query } });
            return data;
        },
        enabled: !!query,
    });
};

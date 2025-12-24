import client from './client';

export const getBanners = async () => {
    try {
        const response = await client.get('/banners?activeOnly=true');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Helper to construct full image URLs for local storage or remote URLs
 * @param {string} path - The image path from the backend (e.g., "/uploads/..." or "https://...")
 * @returns {string} - The full URL to the image
 */
export const getImageUrl = (path) => {
    if (!path) return '/placeholder-image.png'; // Return a placeholder if no path

    // If it's already a full URL (e.g. if we switch to Cloudinary later or external links)
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a blob/data URL (for previews)
    if (path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }

    // Otherwise, assume it's a relative path from the API
    // Ensure VITE_API_URL is defined, fallback to localhost
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${apiUrl}${cleanPath}`;
};

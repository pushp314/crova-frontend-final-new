import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'Crova - Premium Fashion & Lifestyle',
    description = 'Discover curated collections of premium fashion, designed for elegance and comfort. Shop the latest trends in women\'s and men\'s clothing.',
    image = 'https://crova.in/og-image.jpg', // You should upload this image to public folder or use external
    url = typeof window !== 'undefined' ? window.location.href : 'https://crova.in',
    type = 'website'
}) => {
    const siteUrl = 'https://crova.in';
    const fullTitle = title.includes('Crova') ? title : `${title} | Crova`;
    const canonicalUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;

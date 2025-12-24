import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://crova.in';

const staticRoutes = [
    '/',
    '/shop',
    '/category/women',
    '/category/men',
    '/collections',
    '/about',
    '/contact',
    '/journal',
    '/faq',
    '/custom-design',
    '/login',
    '/register'
];

// Note: In a real scenario, you'd fetch product slugs from your API here
// const fetchProducts = async () => { ... }

const generateSitemap = async () => {
    console.log('Generating sitemap.xml...');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticRoutes.map(route => `
    <url>
        <loc>${DOMAIN}${route}</loc>
        <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
        <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>
    `).join('')}
</urlset>`;

    const publicDir = path.join(__dirname, '../public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Ensure public dir exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`✅ Sitemap generated at ${sitemapPath}`);
};

generateSitemap();

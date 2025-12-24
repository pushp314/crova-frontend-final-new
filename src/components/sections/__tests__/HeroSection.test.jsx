import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import HeroSection from '../hero';
import { getBanners } from '../../../api/banners';

// Mock API
vi.mock('../../../api/banners', () => ({
    getBanners: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('HeroSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Verify environment variable stubbing if needed
        vi.stubEnv('VITE_API_URL', 'http://localhost:8080');
    });

    const mockBanner = {
        id: '1',
        title: 'Test Banner Title',
        subtitle: 'Test Banner Subtitle',
        image: '/uploads/banners/test.jpg',
        type: 'IMAGE',
        link: '/test-link',
        isActive: true,
    };

    it('renders default content when no banner is active or fetch fails', async () => {
        getBanners.mockResolvedValue({ success: true, data: { banners: [] } });

        render(
            <MemoryRouter>
                <HeroSection />
            </MemoryRouter>
        );

        // Should wait for loading to finish and show default fallback
        await waitFor(() => {
            expect(screen.getByText(/Effortless Style/i)).toBeInTheDocument();
        });
    });

    it('renders fetched banner content', async () => {
        getBanners.mockResolvedValue({
            success: true,
            data: { banners: [mockBanner] },
        });

        render(
            <MemoryRouter>
                <HeroSection />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Banner Title')).toBeInTheDocument();
            expect(screen.getByText('Test Banner Subtitle')).toBeInTheDocument();
        });

        // Verify image source
        const img = screen.getByRole('img', { name: 'Test Banner Title' });
        expect(img).toHaveAttribute('src', 'http://localhost:8080/uploads/banners/test.jpg');
    });

    it('navigates to internal link on banner click', async () => {
        getBanners.mockResolvedValue({
            success: true,
            data: { banners: [mockBanner] },
        });

        render(
            <MemoryRouter>
                <HeroSection />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Banner Title')).toBeInTheDocument();
        });

        // Click on the section (the main container is clickable)
        // We can find it by looking for the section tag or by text and going up
        // Simplest: click the text, which propagates to the section
        fireEvent.click(screen.getByText('Test Banner Title'));

        expect(mockNavigate).toHaveBeenCalledWith('/test-link');
    });

    it('navigates to external link on banner click', async () => {
        const externalBanner = { ...mockBanner, link: 'https://example.com' };
        getBanners.mockResolvedValue({
            success: true,
            data: { banners: [externalBanner] },
        });

        // Mock window.location.href
        // Note: jsdom does not support navigation. We mock assign.
        // But standard window.location assign is read-only in some envs.
        // Better to check if existing code assigns to window.location.href directly.
        // Code: window.location.href = banner.link;

        // We can use vi.spyOn(window, 'location', 'get') if using HappyDOM, but in JSDOM location is tricky.
        // Alternative: Object.defineProperty(window, 'location', ...)

        const originalLocation = window.location;
        delete window.location;
        window.location = { href: '' };

        render(
            <MemoryRouter>
                <HeroSection />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Banner Title')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Test Banner Title'));

        expect(window.location.href).toBe('https://example.com');

        // Restore
        window.location = originalLocation;
    });

    it('does NOT navigate when clicking Shop buttons', async () => {
        getBanners.mockResolvedValue({
            success: true,
            data: { banners: [mockBanner] },
        });

        render(
            <MemoryRouter>
                <HeroSection />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Banner Title')).toBeInTheDocument();
        });

        // Click Shop Women
        const shopBtn = screen.getByText('Shop Women');
        fireEvent.click(shopBtn);

        // Should NOT allow banner click propagation to trigger navigate
        // Actually the click handler has: if ((e.target as HTMLElement).closest('a') ... return;
        // Link component renders an <a>.
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});

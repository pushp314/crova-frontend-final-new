import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Force scroll to top instantly
        window.scrollTo(0, 0);

        // Also find if Lenis is active on body and reset it
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;

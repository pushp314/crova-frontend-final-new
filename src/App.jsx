import { useEffect, useState, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Outlet } from 'react-router-dom';

const Loading = () => (
  <div className="flex h-screen items-center justify-center bg-white text-black">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
  </div>
);
import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import PastelDreamsCollection from "@/components/sections/pastel-dreams-collection";
import BrandStory from "@/components/sections/brand-story";
import Summer2025Collection from "@/components/sections/summer-2025-collection";
import ShopCategories from "@/components/sections/shop-categories";
import FeaturesGrid from "@/components/sections/features-grid";
import Footer from "@/components/sections/footer";
import AuthModal from "@/components/sections/auth-modal";
import MobileBottomNav from "./components/MobileBottomNav";

// Lazy Load Pages
const Shop = lazy(() => import("./pages/Shop"));
const ShopWomen = lazy(() => import("./pages/ShopWomen"));
const ShopMen = lazy(() => import("./pages/ShopMen"));
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Cart = lazy(() => import("./pages/Cart"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const About = lazy(() => import("./pages/About"));
const Collections = lazy(() => import("./pages/Collections"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Journal = lazy(() => import("./pages/Journal"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminCollections = lazy(() => import("./pages/admin/AdminCollections"));
const AdminCollectionForm = lazy(() => import("./pages/admin/AdminCollectionForm"));
const AdminDesignInquiries = lazy(() => import("./pages/admin/AdminDesignInquiries"));
const CustomDesign = lazy(() => import("./pages/CustomDesign"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

import { getBanners } from './api/banners';
import BannerPopup from './components/BannerPopup';
import TopBar from './components/TopBar';

function Layout() {
  const [banner, setBanner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showTopBar, setShowTopBar] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await getBanners();
        if (response.success && response.data?.banners?.length > 0) {
          setBanner(response.data.banners[0]);
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };

    fetchBanner();
    fetchBanner();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
    setShowTopBar(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <BannerPopup
        banner={banner}
        isOpen={showPopup}
        onClose={handlePopupClose}
      />
      <TopBar
        text={banner?.title ? `${banner.title} ${banner.subtitle ? `- ${banner.subtitle}` : ''}` : ''}
        link={banner?.link}
        isVisible={showTopBar}
      />
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <AuthModal />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}


function HomePage() {
  return (
    <>
      <div className="pt-[56px]">
        <HeroSection />
        <PastelDreamsCollection />
        <BrandStory />
        <Summer2025Collection />
        <ShopCategories />
        <FeaturesGrid />
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="shop" element={<Shop />} />

              {/* Women Routes */}
              <Route path="category/women" element={<ShopWomen />} />
              <Route path="category/women/:subCategory" element={<ShopWomen />} />

              {/* Men Routes */}
              <Route path="category/men" element={<ShopMen />} />
              <Route path="category/men/:subCategory" element={<ShopMen />} />

              {/* Collections */}
              <Route path="collections" element={<Collections />} />
              <Route path="collections/:collectionSlug" element={<CollectionDetail />} />

              <Route path="category/:categorySlug" element={<CategoryPage />} />
              <Route path="product/:slug" element={<ProductDetails />} />
              <Route path="auth" element={<Auth />} />
              <Route path="auth/success" element={<AuthSuccess />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="cart" element={<Cart />} />
              <Route path="about" element={<About />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="journal" element={<Journal />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="custom-design" element={<CustomDesign />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />

              {/* Fallback for undefined routes within layout */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        } />
      </Route>

      {/* Admin Routes with separate Suspense */}
      <Route path="/admin" element={
        <Suspense fallback={<Loading />}>
          <AdminLayout />
        </Suspense>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="collections/new" element={<AdminCollectionForm />} />
        <Route path="collections/:id/edit" element={<AdminCollectionForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="designs" element={<AdminDesignInquiries />} />
      </Route>
    </Routes>
  );
}

export default App;


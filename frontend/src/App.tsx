import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import EnquiryModal from "@/components/EnquiryModal";
import { EnquiryModalProvider } from "@/context/EnquiryModalContext";
import Index from "./pages/Index";
import LivingPage from "./pages/LivingPage";
import DiningPage from "./pages/DiningPage";
import BedroomPage from "./pages/BedroomPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import BlogsPage from "./pages/BlogsPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import FaqPage from "./pages/FaqPage";
import StoresPage from "./pages/StoresPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import CollectionsPage from "./pages/CollectionsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./pages/AdminLayout";
import AdminPage from "./pages/AdminPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminCategoryFormPage from "./pages/AdminCategoryFormPage";
import AdminSiteSettingsPage from "./pages/AdminSiteSettingsPage";
import AdminAboutPage from "./pages/AdminAboutPage";
import AdminFaqsPage from "./pages/AdminFaqsPage";
import AdminCompletedProjectsPage from "./pages/AdminCompletedProjectsPage";
import AdminTestimonialsPage from "./pages/AdminTestimonialsPage";
import AdminPromoStripPage from "./pages/AdminPromoStripPage";
import AdminStoreFormPage from "./pages/AdminStoreFormPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import { AdminAuthProvider } from "./context/AdminAuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EnquiryModalProvider>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CartDrawer />
            <WhatsAppButton />
            <EnquiryModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/living" element={<LivingPage />} />
              <Route path="/dining" element={<DiningPage />} />
              <Route path="/bedroom" element={<BedroomPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
              <Route path="/return-policy" element={<ReturnPolicyPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/stores/:id" element={<StoreDetailPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="categories/new" element={<AdminCategoryFormPage />} />
                <Route path="categories/:slug/edit" element={<AdminCategoryFormPage />} />
                <Route path="stores/new" element={<AdminStoreFormPage />} />
                <Route path="stores/:id/edit" element={<AdminStoreFormPage />} />
                <Route path="site-settings" element={<AdminSiteSettingsPage />} />
                <Route path="about-page" element={<AdminAboutPage />} />
                <Route path="faqs" element={<AdminFaqsPage />} />
                <Route path="completed-projects" element={<AdminCompletedProjectsPage />} />
                <Route path="testimonials" element={<AdminTestimonialsPage />} />
                <Route path="promo-strip" element={<AdminPromoStripPage />} />
              </Route>
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
          </AdminAuthProvider>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
    </EnquiryModalProvider>
  </QueryClientProvider>
);

export default App;

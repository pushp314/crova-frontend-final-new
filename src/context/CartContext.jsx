import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import {
    useCart as useCartQuery,
    useAddToCart,
    useRemoveFromCart,
    useUpdateCartItem,
    useClearCart
} from '../hooks/queries/useCart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, openAuthModal } = useAuth();

    // React Query Hooks
    const { data: cartData, isLoading: cartLoading } = useCartQuery({
        enabled: !!user,
    });

    const cart = cartData?.data?.cart || cartData?.cart || null;

    const { mutateAsync: addToCartMutation } = useAddToCart();
    const { mutateAsync: removeFromCartMutation } = useRemoveFromCart();
    const { mutateAsync: updateQuantityMutation } = useUpdateCartItem();
    const { mutateAsync: clearCartMutation } = useClearCart();

    const loading = cartLoading;

    // Adapters to match existing Context API
    const addToCart = async (variantId, quantity, customColor) => {
        if (!user) {
            openAuthModal();
            throw new Error('User not authenticated');
        }
        return addToCartMutation({ variantId, quantity, customColor });
    };

    const removeFromCart = async (itemId, customColor) => {
        if (!user) return;
        return removeFromCartMutation({ variantId: itemId, customColor });
    };

    const updateQuantity = async (itemId, quantity, customColor) => {
        if (!user) return;
        return updateQuantityMutation({ variantId: itemId, quantity, customColor });
    };

    const clearCart = async () => {
        if (!user) return;
        return clearCartMutation();
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

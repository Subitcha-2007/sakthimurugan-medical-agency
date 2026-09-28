import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isApprovedClient } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, gstTotal: 0, grandTotal: 0 });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchCart = async () => {
    if (!isApprovedClient) {
      setCart({ items: [], subtotal: 0, gstTotal: 0, grandTotal: 0 });
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.cart || { items: [], subtotal: 0, gstTotal: 0, grandTotal: 0 });
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (medicineId, quantity = 1) => {
    if (!user) {
      showToast('Please log in with an approved business account to purchase wholesale medicines', 'warning');
      return false;
    }

    if (!isApprovedClient) {
      if (user.role === 'client' && user.accountStatus === 'pending') {
        showToast('Your account is awaiting admin approval. Wholesale purchasing is restricted.', 'error');
      } else if (user.role === 'client' && user.accountStatus === 'rejected') {
        showToast('Your business application was not approved for wholesale ordering.', 'error');
      } else if (user.role === 'admin' || user.role === 'staff') {
        showToast('Staff/Admin accounts are for operations. Use an approved client account for ordering.', 'info');
      }
      return false;
    }

    try {
      setLoading(true);
      const res = await api.post('/cart/items', { medicineId, quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        showToast(res.data.message || 'Added to wholesale cart!', 'success');
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      showToast(msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      showToast(msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const res = await api.delete(`/cart/items/${itemId}`);
      if (res.data.success) {
        setCart(res.data.cart);
        showToast('Item removed from cart', 'info');
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      showToast(msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await api.delete('/cart');
      setCart({ items: [], subtotal: 0, gstTotal: 0, grandTotal: 0 });
      showToast('Cart cleared', 'info');
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalItemsCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItemsCount,
        toastMessage,
        showToast,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

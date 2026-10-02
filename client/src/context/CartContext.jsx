import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`'${product.name}' is currently out of stock`, 'error');
      return false;
    }

    let addedSuccessfully = true;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const desiredQty = currentQty + quantity;

      if (desiredQty > product.stock) {
        showToast(
          `Cannot add more. Only ${product.stock} units of '${product.name}' available in stock.`,
          'error'
        );
        addedSuccessfully = false;
        if (!existingItem && product.stock > 0) {
          return [...prevCart, { product, quantity: product.stock }];
        }
        return prevCart.map((item) =>
          item.product._id === product._id ? { ...item, quantity: product.stock } : item
        );
      }

      showToast(`Added '${product.name}' to cart`, 'success');

      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id ? { ...item, quantity: desiredQty } : item
        );
      }

      return [...prevCart, { product, quantity: desiredQty }];
    });

    return addedSuccessfully;
  };

  const updateQuantity = (productId, newQty) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product._id === productId);
      if (!item) return prevCart;

      if (newQty <= 0) {
        showToast(`Removed '${item.product.name}' from cart`, 'info');
        return prevCart.filter((i) => i.product._id !== productId);
      }

      if (newQty > item.product.stock) {
        showToast(
          `Maximum stock limit reached (${item.product.stock} available for '${item.product.name}')`,
          'error'
        );
        return prevCart.map((i) =>
          i.product._id === productId ? { ...i, quantity: item.product.stock } : i
        );
      }

      return prevCart.map((i) =>
        i.product._id === productId ? { ...i, quantity: newQty } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product._id === productId);
      if (item) {
        showToast(`Removed '${item.product.name}' from cart`, 'info');
      }
      return prevCart.filter((i) => i.product._id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

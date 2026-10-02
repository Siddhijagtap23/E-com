import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('ecom_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ecom_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  // Add item to cart with stock boundary protection
  const addToCart = (product, quantity = 1) => {
    const requestedQty = Number(quantity) || 1;
    let errorMsg = null;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = currentQty + requestedQty;

        if (newQty > product.stock) {
          errorMsg = `Cannot add more. Maximum available stock is ${product.stock}`;
          return prevCart;
        }

        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        if (requestedQty > product.stock) {
          errorMsg = `Cannot add ${requestedQty} units. Only ${product.stock} available in stock`;
          return prevCart;
        }

        return [
          ...prevCart,
          {
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
              category: product.category
            },
            quantity: requestedQty
          }
        ];
      }
    });

    if (errorMsg) {
      return { success: false, message: errorMsg };
    }
    return { success: true, message: `Added '${product.name}' to cart` };
  };

  // Update quantity directly with stock limits
  const updateQuantity = (productId, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    let errorMsg = null;
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product._id === productId) {
          if (qty > item.product.stock) {
            errorMsg = `Only ${item.product.stock} items available in stock`;
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      });
    });

    if (errorMsg) {
      return { success: false, message: errorMsg };
    }
    return { success: true };
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ecom_cart');
  };

  // Computed summary
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount: Math.round(totalAmount * 100) / 100,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

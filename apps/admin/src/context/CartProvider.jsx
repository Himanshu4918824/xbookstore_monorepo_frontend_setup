import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CartContext } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth'; // 1. Import the auth hook
import API from '../utils/axiosConfig';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    // 2. Get the auth token and the user loading status from the AuthProvider
    const { authToken, isLoading: isAuthLoading } = useAuth();

    const fetchCart = async () => {
        // Only try to fetch if we have a token
        if (authToken) {
            try {
                const response = await API.get('/api/cart/');
                setCart(response.data);
            } catch (error) {
                console.error("Failed to fetch cart", error);
                // This might happen if the token is stale, we can clear the cart
                setCart(null); 
            }
        } else {
            // If there's no token, the cart is definitely null
            setCart(null);
        }
    };

    // 3. The key change: The useEffect now depends on authToken and isAuthLoading
    useEffect(() => {
        // We only want to run this logic AFTER the AuthProvider has finished its initial loading
        if (!isAuthLoading) {
            fetchCart();
        }
    }, [authToken, isAuthLoading]); // It will re-run when the user logs in/out or when auth loading finishes

    // ... addToCart and other functions remain the same ...
    const addToCart = async (bookId, quantity = 1) => {
        try {
            const response = await API.post('/api/cart/add-item/', { book_id: bookId, quantity: quantity });
            setCart(response.data);
            alert("Item added to cart!");
        } catch (error) {
            console.error("Failed to add item to cart", error);
            alert("Could not add item. Please try again.");
        }
    };


    const increaseQuantity = async (cartItemId) => {
        try {
            const response = await API.post('/api/cart/increase-quantity/', {
                cart_item_id: cartItemId
            });
            setCart(response.data); // Update state with the new cart
        } catch (error) {
            console.error("Failed to increase quantity", error);
        }
    };

    const decreaseQuantity = async (cartItemId) => {
        try {
            const response = await API.post('/api/cart/decrease-quantity/', {
                cart_item_id: cartItemId
            });
            setCart(response.data); // Update state with the new cart
        } catch (error) {
            console.error("Failed to decrease quantity", error);
        }
    };
    
    const removeFromCart = async (cartItemId) => {
        try {
            // Call our new backend endpoint
            const response = await API.post('/api/cart/remove-item/', {
                cart_item_id: cartItemId
            });
            // Update the entire cart state with the response from the server
            setCart(response.data);
            alert("Item removed from cart.");
        } catch (error) {
            console.error("Failed to remove item from cart", error);
            alert("Could not remove item. Please try again.");
        }
    };
    
    const clearCart = async () => {
        // We will need a backend endpoint for this. For now, we can just clear the state.
        // A better implementation would be a POST to /api/cart/clear/
        setCart(null); 
    };

    const value = { 
        cart, // Pass the whole cart object
        cartItems: cart ? cart.items : [], // For convenience
        addToCart, 
        removeFromCart, 
        clearCart,
        increaseQuantity, // Add the new functions to the context value
        decreaseQuantity,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
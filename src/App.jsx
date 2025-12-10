import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // UBAH DI SINI
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import './styles/App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('amv_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('amv_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += product.quantity || 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const updateCart = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  // ✅ FUNGSI CLEAR CART (DITAMBAHKAN)
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <div className="App">
        <Header 
          cartCount={cartCount}
          onSearch={setSearchQuery}
        />

        <main className="main-content">
          <Routes>

            <Route 
              path="/" 
              element={<Home addToCart={addToCart} />} 
            />

            <Route 
              path="/products" 
              element={
                <Products 
                  addToCart={addToCart}
                  searchQuery={searchQuery}
                />
              } 
            />

            <Route 
              path="/product/:id" 
              element={
                <ProductDetail addToCart={addToCart} />
              } 
            />

            {/* ✅ CART ROUTE UPDATED */}
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cartItems={cartItems}
                  updateCart={updateCart}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  addToCart={addToCart}   // untuk rekomendasi produk
                />
              } 
            />

            <Route 
              path="/checkout" 
              element={
                <Checkout 
                  cartItems={cartItems}
                  clearCart={clearCart}
                />
              } 
            />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
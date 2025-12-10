import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { FaShippingFast, FaShieldAlt, FaExchangeAlt, FaTag, FaChevronRight } from 'react-icons/fa';

const Home = ({ addToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await api.getProducts();
        // Take first 4 as featured
        setFeaturedProducts(products.slice(0, 4));
        // Take next 4 as new arrivals
        setNewArrivals(products.slice(4, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const features = [
    {
      icon: <FaShippingFast />,
      title: 'Gratis Ongkir',
      description: 'Min. belanja Rp 500.000'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Garansi 1 Tahun',
      description: 'Garansi resmi produsen'
    },
    {
      icon: <FaExchangeAlt />,
      title: '30 Hari Retur',
      description: 'Pengembalian mudah'
    },
    {
      icon: <FaTag />,
      title: 'Harga Terbaik',
      description: 'Garansi harga termurah'
    }
  ];

  const categories = [
    { name: 'Running', icon: '🏃', count: 2 },
    { name: 'Casual', icon: '👟', count: 3 },
    { name: 'Basketball', icon: '🏀', count: 1 },
    { name: 'Hiking', icon: '🥾', count: 1 },
    { name: 'Skate', icon: '🛹', count: 1 },
    { name: 'Football', icon: '⚽', count: 1 },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-slider">
          <div className="hero-slide active">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Step into <span className="highlight">Style</span>
                </h1>
                <p className="hero-subtitle">
                  Koleksi sepatu terbaru dengan kualitas premium dan harga terbaik
                </p>
                <Link to="/products" className="btn btn-hero">
                  Belanja Sekarang
                  <FaChevronRight />
                </Link>
              </div>
              <div className="hero-image">
                <div className="image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                    alt="AMV Footwear"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Indicators */}
        <div className="hero-indicators">
          <button className="indicator active"></button>
          <button className="indicator"></button>
          <button className="indicator"></button>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mengapa Pilih AMV Footwear?</h2>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Kategori Populer</h2>
            <Link to="/products" className="view-all">
              Lihat Semua <FaChevronRight />
            </Link>
          </div>
          
          <div className="categories-scroll">
            <div className="categories-container">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className={`category-card ${activeCategory === category.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-content">
                    <h3>{category.name}</h3>
                    <p>{category.count} produk</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Produk Unggulan</h2>
            <Link to="/products" className="view-all">
              Lihat Semua <FaChevronRight />
            </Link>
          </div>
          
          <div className="products-scroll">
            <div className="products-container">
              {featuredProducts.map(product => (
                <div key={product.id} className="product-item">
                  <ProductCard 
                    product={product} 
                    onAddToCart={() => addToCart(product)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <h2>Sale Besar-besaran!</h2>
              <p>Diskon hingga 50% untuk koleksi terpilih</p>
              <div className="timer">
                <div className="time-unit">
                  <span className="time">02</span>
                  <span className="label">Hari</span>
                </div>
                <div className="time-unit">
                  <span className="time">12</span>
                  <span className="label">Jam</span>
                </div>
                <div className="time-unit">
                  <span className="time">45</span>
                  <span className="label">Menit</span>
                </div>
              </div>
            </div>
            <Link to="/sale" className="btn btn-promo">
              Belanja Sale
              <FaChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Baru Datang</h2>
            <Link to="/products" className="view-all">
              Lihat Semua <FaChevronRight />
            </Link>
          </div>
          
          <div className="products-grid">
            {newArrivals.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Dapatkan Info Promo</h2>
            <p>Dapatkan penawaran eksklusif dan info produk baru</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-newsletter">
                Berlangganan
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
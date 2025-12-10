import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaTag, FaCheck } from 'react-icons/fa';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        ...product,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0]
      });
      
      // Show success feedback
      if (viewMode === 'list') {
        alert(`${product.name} ditambahkan ke keranjang!`);
      }
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  if (viewMode === 'list') {
    return (
      <div className="product-card-list">
        <Link to={`/product/${product.id}`} className="product-link-list">
          <div className="list-image-container">
            <div className="list-image">
              <img 
                src={product.image} 
                alt={product.name}
                loading="lazy"
              />
              {product.discount > 0 && (
                <div className="list-discount-badge">
                  <FaTag />
                  <span>-{product.discount}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="list-content">
            <div className="list-header">
              <div className="list-category">{product.category}</div>
              <div className="list-stock">
                {product.stock > 0 ? (
                  <span className="in-stock">
                    <FaCheck /> Tersedia ({product.stock})
                  </span>
                ) : (
                  <span className="out-of-stock">Stok Habis</span>
                )}
              </div>
            </div>

            <h3 className="list-title">{product.name}</h3>
            
            <div className="list-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(product.rating) ? 'filled' : ''}
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviews} ulasan)
              </span>
            </div>

            <p className="list-description">{product.description}</p>

            <div className="list-features">
              <div className="features-grid">
                <div className="feature">
                  <span className="feature-icon">📏</span>
                  <span className="feature-text">{product.sizes.length} ukuran</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎨</span>
                  <span className="feature-text">{product.colors.length} warna</span>
                </div>
                {product.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="feature">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="list-footer">
              <div className="list-price">
                {product.discount > 0 ? (
                  <>
                    <div className="original-price">{formatPrice(product.price)}</div>
                    <div className="discount-price">
                      <span className="discount-percent">-{product.discount}%</span>
                      <span className="final-price">{formatPrice(product.finalPrice)}</span>
                    </div>
                  </>
                ) : (
                  <div className="final-price">{formatPrice(product.price)}</div>
                )}
              </div>

              <div className="list-actions">
                <button 
                  className="btn btn-list-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart />
                  <span>{product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
                </button>
                <button 
                  className="btn btn-list-buy"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Beli Sekarang
                </button>
                <button 
                  className="list-wishlist-btn"
                  onClick={toggleWishlist}
                  title={isWishlisted ? 'Hapus dari Wishlist' : 'Tambahkan ke Wishlist'}
                >
                  <FaHeart className={isWishlisted ? 'filled' : ''} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div 
      className="product-card-grid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="product-link-grid">
        <div className="grid-image-container">
          <div className="grid-image">
            <img 
              src={product.image} 
              alt={product.name}
              loading="lazy"
            />
            
            {/* Badges */}
            <div className="grid-badges">
              {product.discount > 0 && (
                <span className="badge discount-badge">
                  <FaTag />
                  <span>-{product.discount}%</span>
                </span>
              )}
              {product.rating >= 4.5 && (
                <span className="badge rating-badge">
                  <FaStar />
                  <span>Top Rated</span>
                </span>
              )}
              {product.stock < 5 && product.stock > 0 && (
                <span className="badge stock-badge">
                  <span>Stok Terbatas</span>
                </span>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className={`grid-quick-actions ${isHovered ? 'visible' : ''}`}>
              <button 
                className="quick-action-btn wishlist-btn"
                onClick={toggleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FaHeart className={isWishlisted ? 'filled' : ''} />
              </button>
              <button 
                className="quick-action-btn view-btn"
                onClick={handleQuickView}
                aria-label="Quick view"
              >
                <FaEye />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid-content">
          <div className="grid-category">{product.category}</div>
          
          <h3 className="grid-title">{product.name}</h3>
          
          <div className="grid-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < Math.floor(product.rating) ? 'filled' : ''}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          <div className="grid-price">
            {product.discount > 0 ? (
              <>
                <span className="original-price">
                  {formatPrice(product.price)}
                </span>
                <span className="discounted-price">
                  {formatPrice(product.finalPrice)}
                </span>
              </>
            ) : (
              <span className="regular-price">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <div className="grid-features">
            <span className="feature">
              <span className="feature-icon">📏</span>
              {product.sizes.length} ukuran
            </span>
            <span className="feature">
              <span className="feature-icon">🎨</span>
              {product.colors.length} warna
            </span>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className={`grid-add-to-cart ${isHovered ? 'visible' : ''}`}>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <FaShoppingCart />
          <span>{product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
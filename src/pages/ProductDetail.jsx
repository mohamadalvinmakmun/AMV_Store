import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaShareAlt, 
  FaTruck, 
  FaShieldAlt, 
  FaExchangeAlt, 
  FaArrowLeft, 
  FaTag, 
  FaCheck, 
  FaShoppingBag,
  FaExpand,
  FaMinus,
  FaPlus,
  FaRuler,
  FaPalette
} from 'react-icons/fa';
import '../styles/ProductDetail.css';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getProductById(id);
        if (!data) {
          setError('Produk tidak ditemukan');
          return;
        }
        setProduct(data);
        setSelectedSize(data.sizes[0] || '');
        setSelectedColor(data.colors[0] || '');
        
        // Fetch related products
        const allProducts = await api.getProducts();
        const related = allProducts
          .filter(p => p.category === data.category && p.id !== data.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Gagal memuat produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Harap pilih ukuran dan warna terlebih dahulu');
      return;
    }

    const cartItem = {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      originalPrice: product.price
    };

    addToCart(cartItem);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    const message = !isWishlisted ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist';
    
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'wishlist-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Lihat ${product.name} di AMV Footwear - ${product.description}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      
      // Show copy confirmation
      const toast = document.createElement('div');
      toast.className = 'share-toast';
      toast.textContent = 'Link produk disalin ke clipboard!';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 2000);
    }
  };

  const productImages = [
    product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
  ];

  const colorOptions = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#ffffff' },
    { name: 'Blue', code: '#007bff' },
    { name: 'Grey', code: '#6c757d' },
    { name: 'Red', code: '#dc3545' },
    { name: 'Green', code: '#28a745' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="product-error-page">
        <div className="container">
          <div className="error-content">
            <div className="error-icon">😔</div>
            <h2>Produk Tidak Ditemukan</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button className="btn btn-primary" onClick={() => navigate('/products')}>
                <FaShoppingBag /> Lihat Produk Lain
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/')}>
                <FaArrowLeft /> Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      {/* Success Message Toast */}
      {showSuccess && (
        <div className="success-toast">
          <div className="toast-content">
            <FaCheck className="toast-icon" />
            <div className="toast-text">
              <strong>Berhasil!</strong>
              <p>{product.name} ditambahkan ke keranjang</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {showImageZoom && (
        <div className="image-zoom-modal" onClick={() => setShowImageZoom(false)}>
          <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-zoom" onClick={() => setShowImageZoom(false)}>
              ×
            </button>
            <img src={productImages[activeImage]} alt={product.name} />
          </div>
        </div>
      )}

      <div className="product-detail-page">
    

        <div className="container">
          {/* Breadcrumb */}
          <nav className="product-breadcrumb">
            <ol>
              <li><button onClick={() => navigate('/')}>Beranda</button></li>
              <li><button onClick={() => navigate('/products')}>Produk</button></li>
              <li><button onClick={() => navigate(`/products?category=${product.category.toLowerCase()}`)}>{product.category}</button></li>
              <li className="current">{product.name}</li>
            </ol>
          </nav>

          <div className="product-detail-wrapper">
            {/* Product Gallery */}
            <div className="product-gallery">
              <div className="gallery-main">
                <div className="main-image-wrapper">
                  <img 
                    src={productImages[activeImage]} 
                    alt={product.name}
                    onClick={() => setShowImageZoom(true)}
                  />
                  <button 
                    className="zoom-btn"
                    onClick={() => setShowImageZoom(true)}
                    aria-label="Perbesar gambar"
                  >
                    <FaExpand />
                  </button>
                  {product.discount > 0 && (
                    <div className="discount-badge-large">
                      <FaTag />
                      <span>-{product.discount}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="gallery-thumbnails">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Lihat gambar ${index + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="product-info">
              <div className="product-header">
                <div className="category-tag">{product.category}</div>
                <h1 className="product-title">{product.name}</h1>
                
                <div className="product-meta">
                  <div className="rating-info">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(product.rating) ? 'filled' : ''}
                        />
                      ))}
                    </div>
                    <span className="rating-score">{product.rating}</span>
                    <span className="review-count">({product.reviews} ulasan)</span>
                    <span className="product-id">SKU: AMV-{id.toString().padStart(3, '0')}</span>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="price-section">
                <div className="price-display">
                  {product.discount > 0 ? (
                    <>
                      <div className="price-original">{formatPrice(product.price)}</div>
                      <div className="price-discounted">
                        <span className="discount-amount">-{product.discount}%</span>
                        <span className="price-final">{formatPrice(product.finalPrice)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="price-final">{formatPrice(product.price)}</div>
                  )}
                </div>
                
                <div className="stock-info">
                  {product.stock > 0 ? (
                    <span className="stock-available">
                      <FaCheck /> <strong>Tersedia:</strong> {product.stock} stok
                    </span>
                  ) : (
                    <span className="stock-unavailable">Stok Habis</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="description-section">
                <h3>Deskripsi Produk</h3>
                <p>{product.description}</p>
                
                <div className="key-features">
                  <h4>Keunggulan:</h4>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>
                        <FaCheck />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Size Selection */}
              <div className="size-selection">
                <div className="selection-header">
                  <h3><FaRuler /> Pilih Ukuran</h3>
                  <button className="size-guide">Panduan Ukuran</button>
                </div>
                <div className="size-options-grid">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="color-selection">
                <div className="selection-header">
                  <h3><FaPalette /> Pilih Warna</h3>
                  <span className="color-name-display">{selectedColor}</span>
                </div>
                <div className="color-options-grid">
                  {product.colors.map(color => {
                    const colorObj = colorOptions.find(c => c.name === color) || { name: color, code: '#cccccc' };
                    return (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        style={{ backgroundColor: colorObj.code }}
                      >
                        {selectedColor === color && <FaCheck />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="action-section">
                <div className="quantity-selector">
                  <div className="quantity-control">
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        if (value >= 1 && value <= product.stock) {
                          setQuantity(value);
                        }
                      }}
                      className="quantity-input"
                    />
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="quantity-info">
                    <span className="stock-left">
                      {product.stock} stok tersedia
                    </span>
                    <span className="total-price">
                      Total: <strong>{formatPrice(product.finalPrice * quantity)}</strong>
                    </span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className={`btn btn-primary btn-cart ${product.stock === 0 ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart />
                    {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                  </button>
                  
                  <button 
                    className={`btn btn-secondary btn-buy ${product.stock === 0 ? 'disabled' : ''}`}
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>

              {/* Product Benefits */}
              <div className="benefits-section">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaTruck />
                  </div>
                  <div className="benefit-content">
                    <h4>Gratis Ongkir</h4>
                    <p>Untuk pembelian di atas Rp 500.000</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="benefit-content">
                    <h4>Garansi 1 Tahun</h4>
                    <p>Garansi resmi dari AMV Footwear</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaExchangeAlt />
                  </div>
                  <div className="benefit-content">
                    <h4>30 Hari Retur</h4>
                    <p>Pengembalian barang mudah</p>
                  </div>
                </div>
              </div>

              {/* Desktop Wishlist & Share */}
              <div className="desktop-social-actions">
                <button 
                  className="social-btn wishlist-btn"
                  onClick={toggleWishlist}
                >
                  <FaHeart className={isWishlisted ? 'filled' : ''} />
                  <span>{isWishlisted ? 'Di Wishlist' : 'Tambahkan ke Wishlist'}</span>
                </button>
                <button 
                  className="social-btn share-btn"
                  onClick={shareProduct}
                >
                  <FaShareAlt />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="related-products-section">
              <div className="section-header">
                <h2>Produk Serupa</h2>
                <button 
                  className="view-all-related"
                  onClick={() => navigate(`/products?category=${product.category.toLowerCase()}`)}
                >
                  Lihat Semua
                </button>
              </div>
              
              <div className="related-products-grid">
                {relatedProducts.map(relatedProduct => (
                  <div key={relatedProduct.id} className="related-product-item">
                    <ProductCard 
                      product={relatedProduct} 
                      onAddToCart={() => addToCart(relatedProduct)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Product Specifications */}
          <div className="specifications-section">
            <h3>Spesifikasi Teknis</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Kategori</span>
                <span className="spec-value">{product.category}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Ukuran Tersedia</span>
                <span className="spec-value">{product.sizes.join(', ')}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Warna Tersedia</span>
                <span className="spec-value">{product.colors.join(', ')}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Rating</span>
                <span className="spec-value">{product.rating}/5 ({product.reviews} ulasan)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Garansi</span>
                <span className="spec-value">1 Tahun</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Berat</span>
                <span className="spec-value">± 800g per pasang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
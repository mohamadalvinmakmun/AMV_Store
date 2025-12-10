import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaTrashAlt, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft, 
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaExchangeAlt,
  FaTimes
} from 'react-icons/fa';
import '../styles/Cart.css';

const Cart = ({ cartItems, updateCart, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.discount > 0 && item.originalPrice) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = subtotal > 500000 ? 0 : 25000;
    return subtotal - discount + shipping;
  };

  const getShippingCost = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500000 ? 0 : 25000;
  };

  const getFreeShippingRemaining = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, 500000 - subtotal);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Keranjang Anda masih kosong');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    setShowDeleteConfirm(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowDeleteConfirm(false);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <FaShoppingCart />
            </div>
            <h2>Keranjang Belanja Kosong</h2>
            <p>Belum ada produk di keranjang belanja Anda</p>
            <div className="empty-cart-actions">
              <button 
                className="btn btn-primary"
                onClick={handleContinueShopping}
              >
                <FaArrowLeft /> Mulai Belanja
              </button>
              <Link to="/products?category=popular" className="btn btn-outline">
                Lihat Produk Populer
              </Link>
            </div>
            <div className="empty-cart-features">
              <div className="feature">
                <FaTruck />
                <span>Gratis Ongkir</span>
              </div>
              <div className="feature">
                <FaShieldAlt />
                <span>Garansi 1 Tahun</span>
              </div>
              <div className="feature">
                <FaExchangeAlt />
                <span>30 Hari Retur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Hapus Semua Item?</h3>
              <button 
                className="close-modal"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>Apakah Anda yakin ingin menghapus semua item dari keranjang?</p>
              <p className="warning">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Batal
              </button>
              <button 
                className="btn btn-delete"
                onClick={confirmClearCart}
              >
                Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="cart-header">
          <div className="header-left">
            <h1>Keranjang Belanja</h1>
            <p className="item-count">{cartItems.length} produk</p>
          </div>
          <div className="header-right">
            <button 
              className="btn-clear-all"
              onClick={handleClearCart}
              disabled={cartItems.length === 0}
            >
              <FaTrashAlt /> Hapus Semua
            </button>
          </div>
        </div>

        <div className="cart-layout">
          {/* Main Cart Content */}
          <div className="cart-main">
            {/* Desktop Table Header */}
            <div className="cart-table-header desktop-only">
              <div className="col-product">Produk</div>
              <div className="col-price">Harga</div>
              <div className="col-quantity">Jumlah</div>
              <div className="col-total">Subtotal</div>
              <div className="col-actions"></div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                  {/* Product Image & Info */}
                  <div className="product-info">
                    <div className="product-image">
                      <img src={item.image} alt={item.name} />
                      <button 
                        className="remove-item-mobile"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Hapus item"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">{item.name}</h3>
                      <div className="product-meta">
                        <span className="category">{item.category}</span>
                        <span className="separator">•</span>
                        <span className="size">Ukuran: {item.size}</span>
                        <span className="separator">•</span>
                        <span className="color">Warna: {item.color}</span>
                      </div>
                      
                      {/* Mobile Price Display */}
                      <div className="mobile-price-info">
                        <div className="price-row">
                          {item.discount > 0 && item.originalPrice ? (
                            <>
                              <span className="original-price">
                                {formatPrice(item.originalPrice)}
                              </span>
                              <span className="discounted-price">
                                {formatPrice(item.price)}
                              </span>
                            </>
                          ) : (
                            <span className="current-price">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                        <div className="item-total-mobile">
                          <span>Subtotal:</span>
                          <span className="total-amount">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Price Column */}
                  <div className="price-column desktop-only">
                    {item.discount > 0 && item.originalPrice ? (
                      <div className="price-container">
                        <span className="original-price">
                          {formatPrice(item.originalPrice)}
                        </span>
                        <span className="discounted-price">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ) : (
                      <div className="current-price">
                        {formatPrice(item.price)}
                      </div>
                    )}
                  </div>

                  {/* Quantity Control */}
                  <div className="quantity-column">
                    <div className="quantity-control">
                      <button 
                        className="qty-btn minus"
                        onClick={() => updateCart(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        aria-label="Kurangi jumlah"
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 1 && value <= 99) {
                            updateCart(item.id, value);
                          }
                        }}
                        className="quantity-input"
                        aria-label="Jumlah produk"
                      />
                      <button 
                        className="qty-btn plus"
                        onClick={() => updateCart(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                        aria-label="Tambah jumlah"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="mobile-quantity-label">
                      Jumlah: <span>{item.quantity}</span>
                    </div>
                  </div>

                  {/* Total Price Column */}
                  <div className="total-column desktop-only">
                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="actions-column">
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Hapus item"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Actions */}
            <div className="cart-actions">
              <button 
                className="btn btn-continue"
                onClick={handleContinueShopping}
              >
                <FaArrowLeft /> Lanjutkan Belanja
              </button>
              <div className="cart-summary-mobile">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} item)</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="summary-row">
                  <span>Ongkos Kirim</span>
                  <span>
                    {getShippingCost() === 0 ? 'GRATIS' : formatPrice(getShippingCost())}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>

            {/* Shipping Progress */}
            {getFreeShippingRemaining() > 0 && (
              <div className="shipping-progress">
                <div className="progress-header">
                  <FaTruck />
                  <span>
                    Tambah {formatPrice(getFreeShippingRemaining())} lagi untuk gratis ongkir!
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min((calculateSubtotal() / 500000) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="progress-labels">
                  <span>Rp 0</span>
                  <span className="free-shipping-label">Gratis Ongkir</span>
                  <span>Rp 500.000</span>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="cart-recommendations">
              <h3>Mungkin Anda Suka</h3>
              <div className="recommendations-grid">
                {/* Recommended products would be fetched from API */}
                {cartItems.slice(0, 3).map(item => (
                  <div key={`rec-${item.id}`} className="recommendation-item">
                    <div className="rec-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="rec-info">
                      <h4>{item.name}</h4>
                      <p className="rec-price">{formatPrice(item.price)}</p>
                      <button 
                        className="btn btn-sm"
                        onClick={() => {
                          addToCart({
                            ...item,
                            quantity: 1,
                            size: item.sizes[0],
                            color: item.colors[0]
                          });
                        }}
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-sidebar">
            <div className="summary-card">
              <h2>Ringkasan Pesanan</h2>
              
              <div className="summary-details">
                <div className="summary-item">
                  <span>Subtotal ({cartItems.length} item)</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                
                {calculateDiscount() > 0 && (
                  <div className="summary-item discount">
                    <span>Diskon</span>
                    <span>-{formatPrice(calculateDiscount())}</span>
                  </div>
                )}
                
                <div className="summary-item shipping">
                  <span>Ongkos Kirim</span>
                  <span>
                    {getShippingCost() === 0 ? (
                      <span className="free">GRATIS</span>
                    ) : (
                      formatPrice(getShippingCost())
                    )}
                  </span>
                </div>
                
                {/* Shipping Info */}
                {getFreeShippingRemaining() > 0 && (
                  <div className="shipping-info">
                    <p className="shipping-message">
                      <FaTruck />
                      Tambah {formatPrice(getFreeShippingRemaining())} untuk gratis ongkir
                    </p>
                  </div>
                )}
                
                <div className="summary-total">
                  <span>Total Pembayaran</span>
                  <span className="total-amount">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              
              <button 
                className="btn btn-checkout"
                onClick={handleCheckout}
              >
                <FaCreditCard /> Lanjut ke Pembayaran
              </button>
              
              <div className="payment-methods">
                <p className="methods-title">Metode Pembayaran:</p>
                <div className="methods-grid">
                  <div className="method-item">
                    <span className="method-icon">💳</span>
                    <span className="method-name">Kartu Kredit</span>
                  </div>
                  <div className="method-item">
                    <span className="method-icon">🏦</span>
                    <span className="method-name">Transfer Bank</span>
                  </div>
                  <div className="method-item">
                    <span className="method-icon">📱</span>
                    <span className="method-name">E-Wallet</span>
                  </div>
                  <div className="method-item">
                    <span className="method-icon">💰</span>
                    <span className="method-name">COD</span>
                  </div>
                </div>
              </div>
              
              <div className="guarantee-section">
                <h4>Garansi AMV Footwear</h4>
                <div className="guarantee-items">
                  <div className="guarantee-item">
                    <div className="guarantee-icon">
                      <FaTruck />
                    </div>
                    <div className="guarantee-content">
                      <h5>Gratis Ongkir</h5>
                      <p>Min. belanja Rp 500.000</p>
                    </div>
                  </div>
                  
                  <div className="guarantee-item">
                    <div className="guarantee-icon">
                      <FaShieldAlt />
                    </div>
                    <div className="guarantee-content">
                      <h5>Garansi 1 Tahun</h5>
                      <p>Garansi resmi produsen</p>
                    </div>
                  </div>
                  
                  <div className="guarantee-item">
                    <div className="guarantee-icon">
                      <FaExchangeAlt />
                    </div>
                    <div className="guarantee-content">
                      <h5>30 Hari Retur</h5>
                      <p>Pengembalian mudah</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add to cart function needs to be passed from parent component
export default Cart;
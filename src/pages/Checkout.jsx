import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap diperlukan';
    if (!formData.email.trim()) {
      newErrors.email = 'Email diperlukan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon diperlukan';
    if (!formData.address.trim()) newErrors.address = 'Alamat diperlukan';
    if (!formData.city.trim()) newErrors.city = 'Kota diperlukan';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Generate random order number
    const orderNum = 'AMV' + Date.now().toString().slice(-8);
    setOrderNumber(orderNum);
    setOrderPlaced(true);
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-icon">🛒</div>
            <h2>Keranjang Kosong</h2>
            <p>Tambahkan produk terlebih dahulu sebelum checkout.</p>
            <button className="btn" onClick={() => navigate('/products')}>
              Lihat Produk
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page order-success">
        <div className="container">
          <div className="success-card">
            <div className="success-header">
              <div className="success-icon">✓</div>
              <h2>Pesanan Berhasil!</h2>
              <p className="order-id">ID Pesanan: {orderNumber}</p>
            </div>
            
            <div className="order-details">
              <h3>Detail Pesanan</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Nama</span>
                  <span className="value">{formData.fullName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email</span>
                  <span className="value">{formData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Telepon</span>
                  <span className="value">{formData.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Alamat</span>
                  <span className="value">{formData.address}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Kota</span>
                  <span className="value">{formData.city}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pembayaran</span>
                  <span className="value">
                    {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                     formData.paymentMethod === 'transfer' ? 'Transfer Bank' : 'E-Wallet'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="order-summary">
              <h3>Ringkasan Pesanan</h3>
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.size}`} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>
            
            <div className="success-message">
              <p>📧 Konfirmasi telah dikirim ke {formData.email}</p>
              <p>🚚 Pesanan akan diproses dalam 1-2 hari kerja</p>
              <p>📞 Hubungi kami jika ada pertanyaan: 021-1234-5678</p>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/products')}
              >
                Belanja Lagi
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p className="step-info">Langkah 1 dari 2</p>
        </div>
        
        <div className="checkout-wrapper">
          <div className="checkout-form-container">
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-section">
                <h2>Informasi Pengiriman</h2>
                
                <div className="form-group">
                  <label htmlFor="fullName">Nama Lengkap *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="email@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">No. Telepon *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="0812 3456 7890"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Alamat Lengkap *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`form-input ${errors.address ? 'error' : ''}`}
                    placeholder="Jl. Contoh No. 123, RT/RW, Kecamatan"
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="city">Kota *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="Jakarta"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
              </div>
              
              <div className="form-section">
                <h2>Metode Pembayaran</h2>
                
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <div className="option-icon">💵</div>
                      <div className="option-details">
                        <span className="option-title">Cash on Delivery</span>
                        <span className="option-desc">Bayar saat barang sampai</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${formData.paymentMethod === 'transfer' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <div className="option-icon">🏦</div>
                      <div className="option-details">
                        <span className="option-title">Transfer Bank</span>
                        <span className="option-desc">BCA, Mandiri, BNI, BRI</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${formData.paymentMethod === 'ewallet' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ewallet"
                      checked={formData.paymentMethod === 'ewallet'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <div className="option-icon">📱</div>
                      <div className="option-details">
                        <span className="option-title">E-Wallet</span>
                        <span className="option-desc">OVO, GoPay, DANA, ShopeePay</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-back"
                  onClick={() => navigate('/cart')}
                >
                  ← Kembali ke Keranjang
                </button>
                <button 
                  type="submit" 
                  className="btn btn-submit"
                >
                  Buat Pesanan
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary-sidebar">
            <div className="summary-card">
              <h3>Ringkasan Pesanan</h3>
              
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.size}`} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <div className="total-row">
                  <span>Ongkir</span>
                  <span className="free">GRATIS</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              
              <div className="order-features">
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  <span>Gratis ongkir min. Rp 500.000</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">↩️</span>
                  <span>Garansi 30 hari pengembalian</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span>Pembayaran aman & terenkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
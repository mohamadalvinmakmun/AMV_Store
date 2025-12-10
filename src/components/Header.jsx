import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaSearch, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaChevronDown, 
  FaHome,
  FaBox,
  FaTag,
  FaPhone
} from 'react-icons/fa';
import '../styles/Header.css';

const Header = ({ cartCount, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleMobileLinkClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const mainMenuItems = [
    { 
      icon: <FaHome />, 
      label: 'Beranda', 
      path: '/',
      mobileOnly: false
    },
    { 
      icon: <FaBox />, 
      label: 'Semua Produk', 
      path: '/products',
      mobileOnly: false
    },
    { 
      icon: <FaTag />, 
      label: 'Sale', 
      path: '/sale',
      mobileOnly: false
    },
    { 
      icon: <FaPhone />, 
      label: 'Kontak', 
      path: '/contact',
      mobileOnly: false
    }
  ];

  const categories = [
    { name: 'Running', path: '/products?category=running' },
    { name: 'Casual', path: '/products?category=casual' },
    { name: 'Basketball', path: '/products?category=basketball' },
    { name: 'Hiking', path: '/products?category=hiking' },
    { name: 'Minimalist', path: '/products?category=minimalist' },
    { name: 'Skate', path: '/products?category=skate' },
    { name: 'Football', path: '/products?category=football' },
    { name: 'Boots', path: '/products?category=boots' }
  ];

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="header">
      <div className="container">
        {/* Top Bar */}
        <div className="header-top">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
              <div className="logo-icon">👟</div>
              <div className="logo-text">
                <h1>AMV Footwear</h1>
                <p className="logo-tagline">Step with Style</p>
              </div>
            </Link>
          </div>
          
          <div className="header-center">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari sepatu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  aria-label="Cari produk"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                  >
                    ×
                  </button>
                )}
              </div>
              <button type="submit" className="search-btn" aria-label="Cari">
                Cari
              </button>
            </form>
          </div>
          
          <div className="header-right">
            <Link to="/account" className="header-action" aria-label="Akun">
              <FaUser />
              <span className="action-label">Akun</span>
            </Link>
            <Link to="/cart" className="header-action cart-action" aria-label="Keranjang">
              <div className="cart-wrapper">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="action-label">Keranjang</span>
            </Link>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="desktop-nav-list">
            {mainMenuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className="desktop-nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            
            {/* Categories Dropdown */}
            <li className="desktop-dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => toggleDropdown('categories')}
                aria-expanded={activeDropdown === 'categories'}
              >
                Kategori <FaChevronDown />
              </button>
              <div className={`dropdown-menu ${activeDropdown === 'categories' ? 'show' : ''}`}>
                {categories.map(category => (
                  <Link 
                    key={category.name} 
                    to={category.path}
                    className="dropdown-item"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-container">
          {/* Mobile Search */}
          <div className="mobile-search">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <div className="mobile-search-wrapper">
                <FaSearch className="mobile-search-icon" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                  autoFocus
                />
                <button 
                  type="button" 
                  className="mobile-search-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Tutup pencarian"
                >
                  ×
                </button>
              </div>
            </form>
          </div>
          
          {/* Mobile Main Menu */}
          <div className="mobile-main-menu">
            <div className="mobile-user-section">
              <Link 
                to="/account" 
                className="mobile-user-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser />
                <span>Akun Saya</span>
              </Link>
            </div>
            
            <ul className="mobile-menu-list">
              {mainMenuItems.map((item, index) => (
                <li key={index}>
                  <button 
                    className="mobile-menu-item"
                    onClick={() => handleMobileLinkClick(item.path)}
                  >
                    <span className="mobile-menu-icon">{item.icon}</span>
                    <span className="mobile-menu-label">{item.label}</span>
                    <span className="mobile-menu-arrow">›</span>
                  </button>
                </li>
              ))}
              
              {/* Mobile Categories */}
              <li className="mobile-categories-section">
                <button 
                  className="mobile-category-toggle"
                  onClick={() => toggleDropdown('mobile-categories')}
                  aria-expanded={activeDropdown === 'mobile-categories'}
                >
                  <span className="mobile-menu-icon">🏷️</span>
                  <span className="mobile-menu-label">Kategori</span>
                  <FaChevronDown className={`mobile-dropdown-icon ${activeDropdown === 'mobile-categories' ? 'rotated' : ''}`} />
                </button>
                <div className={`mobile-category-menu ${activeDropdown === 'mobile-categories' ? 'show' : ''}`}>
                  {categories.map(category => (
                    <button
                      key={category.name}
                      className="mobile-category-item"
                      onClick={() => handleMobileLinkClick(category.path)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
            
            {/* Quick Actions */}
            <div className="mobile-quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => handleMobileLinkClick('/new-arrivals')}
              >
                🆕 Baru Datang
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => handleMobileLinkClick('/best-sellers')}
              >
                🔥 Terlaris
              </button>
            </div>
            
            {/* Cart Summary */}
            <div className="mobile-cart-summary">
              <Link 
                to="/cart" 
                className="mobile-cart-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingCart />
                <div className="cart-info">
                  <span className="cart-label">Keranjang Belanja</span>
                  <span className="cart-count">{cartCount} item</span>
                </div>
                <span className="cart-arrow">›</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Bottom Bar */}
          <div className="mobile-bottom-bar">
            <button 
              className="mobile-bottom-btn"
              onClick={() => handleMobileLinkClick('/help')}
            >
              <span className="icon">❓</span>
              <span className="label">Bantuan</span>
            </button>
            <button 
              className="mobile-bottom-btn"
              onClick={() => handleMobileLinkClick('/track-order')}
            >
              <span className="icon">🚚</span>
              <span className="label">Lacak Pesanan</span>
            </button>
            <button 
              className="mobile-bottom-btn"
              onClick={() => handleMobileLinkClick('/stores')}
            >
              <span className="icon">🏪</span>
              <span className="label">Toko Kami</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
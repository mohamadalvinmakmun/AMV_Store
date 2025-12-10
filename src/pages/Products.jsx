import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { 
  FaFilter, 
  FaTimes, 
  FaSortAmountDownAlt, 
  FaSortAmountUp, 
  FaStar, 
  FaFire,
  FaShippingFast,
  FaTag
} from 'react-icons/fa';
import '../styles/Products.css';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    { name: 'Semua', icon: '👟' },
    { name: 'Running', icon: '🏃' },
    { name: 'Casual', icon: '👞' },
    { name: 'Basketball', icon: '🏀' },
    { name: 'Hiking', icon: '🥾' },
    { name: 'Minimalist', icon: '✨' },
    { name: 'Skate', icon: '🛹' },
    { name: 'Football', icon: '⚽' },
    { name: 'Boots', icon: '👢' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
        setFilteredProducts(data);
        
        // Hitung jumlah produk per kategori
        const categoryCounts = {};
        data.forEach(product => {
          const cat = product.category;
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        
        // Update categories dengan jumlah produk
        const updatedCategories = categories.map(cat => {
          if (cat.name === 'Semua') {
            return { ...cat, count: data.length };
          }
          return { 
            ...cat, 
            count: categoryCounts[cat.name] || 0 
          };
        });
        
        setCategories(updatedCategories);
        
        // Parse URL parameters
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        const searchParam = params.get('search');
        
        if (categoryParam) {
          const categoryName = categoryParam === 'semua' ? 'Semua' : 
            categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
          setSelectedCategory(categoryName);
        }
        
        if (searchParam) {
          setSearchQuery(searchParam);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location]);

  useEffect(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== 'Semua') {
      result = result.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price range
    result = result.filter(product => 
      product.finalPrice >= priceRange[0] && product.finalPrice <= priceRange[1]
    );

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // Default sort: Featured first
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, sortBy, searchQuery]);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    navigate(`/products?category=${categoryName === 'Semua' ? 'semua' : categoryName.toLowerCase()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('Semua');
    setPriceRange([0, 2000000]);
    setSortBy('default');
    setSearchQuery('');
    navigate('/products');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPriceRangeLabel = () => {
    if (priceRange[0] === 0 && priceRange[1] === 2000000) {
      return 'Semua Harga';
    }
    return `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1>Koleksi Sepatu AMV</h1>
              <p>Temukan sepatu terbaik untuk setiap langkah Anda</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <FaStar className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">4.8</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <div className="stat-item">
                <FaFire className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{products.length}+</span>
                  <span className="stat-label">Produk</span>
                </div>
              </div>
              <div className="stat-item">
                <FaShippingFast className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">Gratis</span>
                  <span className="stat-label">Ongkir</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="products-container">
          {/* Mobile Filter Button */}
          <button 
            className="mobile-filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            <span>Filter & Sort</span>
          </button>

          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="sidebar-header">
              <h3>Filter Produk</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Search */}
            <div className="filter-section">
              <h4 className="filter-title">Cari Produk</h4>
              <form onSubmit={handleSearch} className="search-filter">
                <input
                  type="text"
                  placeholder="Cari sepatu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-filter-input"
                />
                <button type="submit" className="search-filter-btn">
                  Cari
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="filter-section">
              <h4 className="filter-title">Kategori</h4>
              <div className="categories-filter">
                {categories.map(category => (
                  <button
                    key={category.name}
                    className={`category-filter-btn ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <div className="filter-header">
                <h4 className="filter-title">Rentang Harga</h4>
                <span className="price-range-label">{getPriceRangeLabel()}</span>
              </div>
              <div className="price-range-filter">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-range-slider"
                />
                <div className="price-limits">
                  <span>{formatPrice(0)}</span>
                  <span>{formatPrice(2000000)}</span>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="filter-section">
              <h4 className="filter-title">Urutkan</h4>
              <div className="sort-options">
                <button
                  className={`sort-option ${sortBy === 'default' ? 'active' : ''}`}
                  onClick={() => setSortBy('default')}
                >
                  <span>Rekomendasi</span>
                </button>
                <button
                  className={`sort-option ${sortBy === 'price-low' ? 'active' : ''}`}
                  onClick={() => setSortBy('price-low')}
                >
                  <FaSortAmountDownAlt />
                  <span>Harga: Rendah ke Tinggi</span>
                </button>
                <button
                  className={`sort-option ${sortBy === 'price-high' ? 'active' : ''}`}
                  onClick={() => setSortBy('price-high')}
                >
                  <FaSortAmountUp />
                  <span>Harga: Tinggi ke Rendah</span>
                </button>
                <button
                  className={`sort-option ${sortBy === 'rating' ? 'active' : ''}`}
                  onClick={() => setSortBy('rating')}
                >
                  <FaStar />
                  <span>Rating Tertinggi</span>
                </button>
                <button
                  className={`sort-option ${sortBy === 'discount' ? 'active' : ''}`}
                  onClick={() => setSortBy('discount')}
                >
                  <FaTag />
                  <span>Diskon Terbesar</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="filter-actions">
              <button className="btn btn-clear-filters" onClick={clearFilters}>
                Hapus Semua Filter
              </button>
              <button 
                className="btn btn-apply-filters"
                onClick={() => setShowFilters(false)}
              >
                Terapkan Filter
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            {/* Products Header */}
            <div className="products-main-header">
              <div className="results-info">
                <h2>Semua Produk</h2>
                <p className="results-count">
                  Menampilkan {filteredProducts.length} dari {products.length} produk
                  {selectedCategory !== 'Semua' && (
                    <span className="active-category"> • {selectedCategory}</span>
                  )}
                </p>
              </div>
              
              <div className="products-toolbar">
                <div className="toolbar-right">
                  <span className="sort-label">Urutkan:</span>
                  <select 
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Rekomendasi</option>
                    <option value="price-low">Harga: Rendah ke Tinggi</option>
                    <option value="price-high">Harga: Tinggi ke Rendah</option>
                    <option value="rating">Rating Tertinggi</option>
                    <option value="discount">Diskon Terbesar</option>
                    <option value="name">Nama A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'Semua' || priceRange[0] > 0 || priceRange[1] < 2000000 || searchQuery) && (
              <div className="active-filters">
                <div className="filters-tags">
                  {selectedCategory !== 'Semua' && (
                    <div className="filter-tag">
                      <span>Kategori: {selectedCategory}</span>
                      <button 
                        className="remove-filter"
                        onClick={() => setSelectedCategory('Semua')}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {(priceRange[0] > 0 || priceRange[1] < 2000000) && (
                    <div className="filter-tag">
                      <span>Harga: {getPriceRangeLabel()}</span>
                      <button 
                        className="remove-filter"
                        onClick={() => setPriceRange([0, 2000000])}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {searchQuery && (
                    <div className="filter-tag">
                      <span>Pencarian: "{searchQuery}"</span>
                      <button 
                        className="remove-filter"
                        onClick={() => setSearchQuery('')}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {(selectedCategory !== 'Semua' || priceRange[0] > 0 || priceRange[1] < 2000000 || searchQuery) && (
                    <button className="clear-all-filters" onClick={clearFilters}>
                      Hapus Semua
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="no-products-found">
                <div className="no-products-content">
                  <div className="no-products-icon">😔</div>
                  <h3>Tidak Ada Produk Ditemukan</h3>
                  <p>Coba ubah filter atau kata kunci pencarian Anda</p>
                  <button className="btn btn-reset-filters" onClick={clearFilters}>
                    Reset Semua Filter
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid-view">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}

            {/* Pagination (Placeholder) */}
            {filteredProducts.length > 0 && (
              <div className="products-pagination">
                <button className="pagination-btn prev" disabled>
                  ← Sebelumnya
                </button>
                <div className="pagination-pages">
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <span className="page-dots">...</span>
                  <button className="page-btn">5</button>
                </div>
                <button className="pagination-btn next">
                  Selanjutnya →
                </button>
              </div>
            )}

            {/* Promo Banner */}
            <div className="products-promo-banner">
              <div className="promo-content">
                <div className="promo-text">
                  <h3>🎉 Sale Spesial Akhir Tahun!</h3>
                  <p>Dapatkan diskon hingga 50% untuk koleksi terpilih</p>
                </div>
                <button className="btn btn-promo" onClick={() => navigate('/sale')}>
                  Lihat Promo
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
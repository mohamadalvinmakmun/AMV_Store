import axios from 'axios';

const API_BASE_URL = 'https://api.jsonbin.io/v3/b'; // Ganti dengan URL API sebenarnya
const API_KEY = '$2a$10$YOUR_API_KEY'; // Ganti dengan API key Anda

// Untuk development, kita akan menggunakan data lokal jika API gagal
import localProducts from '../data/products.json';

export const api = {
  async getProducts() {
    try {
      // Jika menggunakan API external
      // const response = await axios.get(`${API_BASE_URL}/latest`, {
      //   headers: { 'X-Master-Key': API_KEY }
      // });
      // return response.data.record;
      
      // Untuk sekarang, return data lokal
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(localProducts);
        }, 500); // Simulasi loading
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return localProducts; // Fallback ke data lokal
    }
  },

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find(product => product.id === parseInt(id)) || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async getProductsByCategory(category) {
    try {
      const products = await this.getProducts();
      return products.filter(product => 
        category === 'all' ? true : product.category === category
      );
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  }
};

export default api;
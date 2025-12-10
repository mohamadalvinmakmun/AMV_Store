import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p className="cart-item-category">{item.category}</p>
        <div className="cart-item-size">
          <strong>Size:</strong> {item.size}
        </div>
        <div className="cart-item-color">
          <strong>Color:</strong> {item.color}
        </div>
      </div>
      
      <div className="cart-item-price">
        <div className="price">{formatPrice(item.price)}</div>
        {item.discount > 0 && (
          <div className="original-price">
            {formatPrice(item.originalPrice)}
          </div>
        )}
      </div>
      
      <div className="cart-item-quantity">
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
        >
          <FaMinus />
        </button>
        <span className="quantity">{item.quantity}</span>
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <FaPlus />
        </button>
      </div>
      
      <div className="cart-item-total">
        <div className="total-price">{formatPrice(totalPrice)}</div>
        <button 
          className="remove-btn"
          onClick={() => onRemove(item.id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
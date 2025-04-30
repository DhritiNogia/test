import React, { useState } from 'react';
import axios from 'axios';
import API from '../api';


const OrderForm = ({ onOrderCreated }) => {
  const [order, setOrder] = useState({ customer_id: '', product_ids: '' });
  const [error, setError] = useState(''); // To store error messages
  const [successMessage, setSuccessMessage] = useState(''); // To store success messages

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!order.customer_id || !order.product_ids) {
      setError('Customer ID and Product IDs are required!');
      return;
    }

    try {
      // Make the API call to create the order
      const response = await axios.post(`${API}/orders/`, { 
        customer_id: order.customer_id,
        product_ids: order.product_ids.split(',').map(id => id.trim())
      });

      // Check if the response contains the expected data
      if (response && response.data) {
        const { message, id } = response.data;

      
        setSuccessMessage(message); // Show success message
        setError(''); // Clear any previous error
        onOrderCreated(); // Notify parent component

        console.log('Order created with ID:', id); 
      }
    } catch (error) {
      console.error('Error:', error);

      // Check if the error response is specific to the customer
      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          setError(error.response.data.detail); // Show specific error message from API
        } else {
          setError('Unexpected error. Please try again.'); // Generic error
        }
      } else if (error.request) {
        setError('Network error: No response from server');
      } else {
        setError('Unexpected error: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h2>Create Order</h2>

      {/* Show specific error message if it exists */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Show success message if it exists */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleOrderSubmit}>
        <input
          placeholder="Customer ID"
          value={order.customer_id}
          onChange={e => setOrder({ ...order, customer_id: e.target.value })}
        />
        <input
          placeholder="Product IDs (comma separated)"
          value={order.product_ids}
          onChange={e => setOrder({ ...order, product_ids: e.target.value })}
        />
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default OrderForm;

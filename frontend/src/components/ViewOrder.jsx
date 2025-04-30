import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';



const ViewOrder = () => {
  const [orderId, setOrderId] = useState(""); // To store the input order ID
  const [order, setOrder] = useState(null); // To store the fetched order
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(""); // To handle error message

  // Fetch order when orderId changes
  useEffect(() => {
    if (!orderId) return; // Exit early if orderId is empty

    const fetchOrder = async () => {
      setLoading(true);
      setError(""); // Reset previous errors
      try {
        const response = await axios.get(`${API}/orders/${orderId}`);
        setOrder(response.data); // Set order data if valid
      } catch (err) {
        setOrder(null); // Reset order data on error
        setError("Error fetching order. Please ensure the Order ID is correct.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]); // Trigger effect only when orderId changes

  const handleOrderIdChange = (event) => {
    setOrderId(event.target.value); // Update orderId as the user types
    setError(''); // Clear any previous errors
    setOrder(null); // Reset the order when input changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId) {
      setError("Please enter a valid Order ID.");
      return;
    }
    setError(""); // Clear any previous errors
    setLoading(true); // Trigger loading state
  };

  return (
    <div>
      <h2>View Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={orderId}
          onChange={handleOrderIdChange}
          placeholder="Enter Order ID"
        />
        <button type="submit">Fetch Order</button>
      </form>

      {/* Display error message if there is an error */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display loading message */}
      {loading && <div>Loading...</div>}

      {/* Display order details only if the order is fetched successfully */}
      {order && (
        <div>
          <h3>Order ID: {order.id}</h3>
          <p><strong>Customer Name:</strong> {order.customer.name}</p>
          <p><strong>Customer Email:</strong> {order.customer.email}</p>
          <p><strong>Total Cost:</strong> ${order.total_cost}</p>
          {order.created_at && <p><strong>Created At:</strong> {order.created_at}</p>}
          <h4>Products:</h4>
          <ul>
            {order.products.map((product, index) => (
              <li key={index}>
                <strong>{product.name}</strong> - ${product.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;

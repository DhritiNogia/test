import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';


const DataTable = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes, ordRes] = await Promise.all([
          axios.get(`${API}/customers/`),
          axios.get(`${API}/products/`),
          axios.get(`${API}/orders/`)
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

      {/* Customers Table */}
      <div style={cardStyle}>
        <h3>Customers</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Name</th>
              <th style={thTdStyle}>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust.id}>
                <td style={thTdStyle}>{cust.id}</td>
                <td style={thTdStyle}>{cust.name}</td>
                <td style={thTdStyle}>{cust.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products Table */}
      <div style={cardStyle}>
        <h3>Products</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Name</th>
              <th style={thTdStyle}>Price ($)</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td style={thTdStyle}>{prod.id}</td>
                <td style={thTdStyle}>{prod.name}</td>
                <td style={thTdStyle}>{prod.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders Table */}
      <div style={cardStyle}>
        <h3>Orders</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Customer ID</th>
              <th style={thTdStyle}>Product IDs</th>
              <th style={thTdStyle}>Total Cost ($)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(ord => (
              <tr key={ord.id}>
                <td style={thTdStyle}>{ord.id}</td>
                <td style={thTdStyle}>{ord.customer_id}</td>
                <td style={thTdStyle}>
                  {ord.product_ids && ord.product_ids.join(", ")}
                </td>
                <td style={thTdStyle}>{ord.total_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "30px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 8px",  // More breathing room
  marginTop: "10px",
};

const thTdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#ffffff",
  fontWeight: "normal",
  borderRadius: "6px",
};

export default DataTable;

import React, { useState } from 'react';
import axios from 'axios';
import API from '../api';



const CustomerForm = ({ onCustomerCreated }) => {
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    if (!customer.name) {
      return "Name is required.";
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return "Please enter a valid email address.";
    }

    return null; // No error
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccessMessage(''); // Clear any previous success message
      return; // Stop submission if validation fails
    }

    try {
      const response = await axios.post(`${API}/customers/`, customer);

      // Check if the response is successful
      if (response.status === 200 && response.data.message === "Customer created successfully") {
        setSuccessMessage('Customer created successfully!');
        setCustomer({ name: '', email: '' }); // Reset form
        setError(''); // Clear any previous error

        // Call the parent function if it exists
        if (onCustomerCreated && typeof onCustomerCreated === 'function') {
          onCustomerCreated(); // Notify parent component
        } else {
          console.error('onCustomerCreated is not a function');
        }
      } else {
        setError('Unexpected error. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);  // <-- Check the error object
      // If error has response, show that detail, otherwise a generic error
      if (error.response) {
        setError(error.response.data.detail || 'Error creating customer');
      } else if (error.request) {
        // This case happens when no response is received from the server
        setError('Network error: No response from server');
      } else {
        setError('Unexpected error: ' + error.message); // Handle other types of errors
      }
    }
  };

  return (
    <div>
      <h2>Create Customer</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Show success message */}
      <form onSubmit={handleCustomerSubmit}>
        <input
          placeholder="Name"
          value={customer.name}
          onChange={e => setCustomer({ ...customer, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={customer.email}
          onChange={e => setCustomer({ ...customer, email: e.target.value })}
        />
        <button type="submit">Create Customer</button>
      </form>
    </div>
  );
};

export default CustomerForm;

import { useState } from 'react';
import api from '../api';
import API from '../api';


function CreateProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!name) {
      return "Product name is required.";
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      return "Please enter a valid price greater than 0.";
    }

    return null; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return; // Stop submission if validation fails
    }

    try {
      await api.post('/products/', { name, price: parseFloat(price) });
      alert('Product created successfully!');
      setName('');
      setPrice('');
      setError(''); // Clear any previous error
    } catch (error) {
      alert('Error creating product: ' + error.response?.data?.detail);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateProductForm;

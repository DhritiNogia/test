import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import CreateCustomerForm from './components/CustomerForm';
import CreateProductForm from './components/ProductForm';
import CreateOrderForm from './components/OrderForm';
import ViewOrder from './components/ViewOrder';
import DataTable from './components/DataTable';
import './App.css'; 

function App() {
  return (
    <BrowserRouter> 
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/customer" className="nav-link">Create Customer</Link>
          <Link to="/product" className="nav-link">Create Product</Link>
          <Link to="/order" className="nav-link">Create Order</Link>
          <Link to="/view-order" className="nav-link">View Order</Link>
          <Link to="/data-table" className='nav-link'>Admin</Link>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="home-title">Simple Orders App</h2>
                <br></br>
                <br></br>
                <p>This app allows you to manage orders with the following features:</p>
                <br></br>
                <br></br>
                <ul>
                  <li><strong>Create a Customer</strong> - Add customers to the system.</li>
                  <li><strong>Create a Product</strong> - Add products that can be ordered.</li>
                  <li><strong>Create an Order</strong> - Create orders by selecting a customer and products.</li>
                  <li><strong>View Orders</strong> - View a list of orders placed.</li>
                </ul>
                <p>The order IDs, customer IDs, and product IDs are auto-generated. You can also peek into the data using the <strong>Admin</strong> section.</p>
              </div>
            } />
            <Route path="/customer" element={<CreateCustomerForm />} />
            <Route path="/product" element={<CreateProductForm />} />
            <Route path="/order" element={<CreateOrderForm />} />
            <Route path="/view-order" element={<ViewOrder />} />
            <Route path="/data-table" element={<DataTable />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter> 
  );
}

export default App;

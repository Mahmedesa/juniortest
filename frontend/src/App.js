import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import ProductsByCategory from './pages/ProductsByCategory';
import { OrderItemsProvider } from './context/CartContext';

function App() {
  return (
    <OrderItemsProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/all" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/category/:id" element={<ProductsByCategory />} />
        </Routes>
      </div>
    </OrderItemsProvider>
  );
}

export default App;

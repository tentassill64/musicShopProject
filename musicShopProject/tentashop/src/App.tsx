import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './header';
import { CategoriesPage } from './apps/Catalog/catalogPage';
import { ProductsPage } from './apps/Products/productsPage';
import { ProductPage } from './apps/Products/productPage';
import { CheckoutPage } from './apps/Checkpoint/checkPointPage';
import { CartProvider } from './hooks/cartContextType';
import { AuthProvider } from './hooks/authContext';
import { UserProfilePage } from './apps/userProfile/UserProfilePage';

function App() {
  return (
    <>
     <AuthProvider>
    <CartProvider>
          <Header siteName="TentaShop" logoUrl="/logo.png" />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/catalog" element={<CategoriesPage />} />
          <Route path="/category/:categoryId/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path='/profile' element={<UserProfilePage/>} />
        </Routes>
      </main>
      </CartProvider>
      </AuthProvider>

    </>
  );
}

export default App;
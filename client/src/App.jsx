import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from "./components/AdminDashBoard/SellerLogin";
import SellerLayout from "./pages/Admin/SellerLayout";
import AddProduct from "./pages/Admin/AddProduct";
import ProductList from "./pages/Admin/ProductList";
import Orders from "./pages/Admin/Orders";
import Loading from './components/Loading';

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin, isSeller} = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

     {/* Navbar is not shown on seller paths */}
     {isSellerPath ? null : <Navbar/>} 
     {/* User login modal is shown if showUserLogin is true */}
     {showUserLogin ? <Login/> : null}

     {/* Toaster for react-hot-toast notifications */}
     <Toaster />

      {/* Conditional padding for main content based on seller path */}
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}> {/* <--- CHANGE: Corrected '1g' to 'lg' and 'x1' to 'xl' for Tailwind CSS */}
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<AllProducts/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/loader' element={<Loading/>} /> {/* Loading component route */}
          
          {/* Seller/Admin Routes */}
          {/* If not a seller, show SellerLogin. Otherwise, show SellerLayout and its children. */}
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            {/* Index route for /seller, defaults to AddProduct if logged in */}
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='orders' element={<Orders/>} />
          </Route>
        </Routes>
      </div>
      {/* Footer is not shown on seller paths */}
     {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App
import React, { useEffect } from 'react';
import { Routes,Route } from 'react-router-dom';
import Layout from './components/ui/auth/Layout.jsx';
import Login from './Pages/auth/Login.jsx';
import Register from './Pages/auth/Register.jsx';
import Admin_Layout from './components/Admin-view/Admin_Layout.jsx';
import AdminDashbord from './Pages/Admin-View/AdminDashbord.jsx';
import AdminProducts from './Pages/Admin-View/AdminProducts.jsx';
import AdminOrders from './Pages/Admin-View/Orders.jsx';
import AdminFeatures from './Pages/Admin-View/AdminFeatures.jsx';
import ShopingLayout from './components/Shoping-view/ShopingLayout.jsx';
import NotFound from './Pages/not-found/NotFound.jsx';
import ShoppingHome from './Pages/Shoping-View/ShoppingHome.jsx';
import ShopingListing from './Pages/Shoping-View/ShopingListing.jsx';
import ShopingCheckOut from './Pages/Shoping-View/ShopingCheckOut.jsx';
import ShopingAccount from './Pages/Shoping-View/ShopingAccount.jsx';
import CheckAuth from './components/Common/CheckAuth.jsx';
import UnAuth_Page from './Pages/UnAuth_Page/UnAuth_Page.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './Store/auth-slice/Index.js';
import { Skeleton } from "@/components/ui/skeleton"
import Paypal_Return1 from './Pages/Shoping-View/Paypal_Return1.jsx';
import Paypal_Cancel from './Pages/Shoping-View/Paypal_Cancel.jsx';
import Payment_Success from './Pages/Shoping-View/Payment_Success.jsx';
import Search from './Pages/Shoping-View/Search.jsx';


// Component Definition
const App = () => {
    const { user, isAuthenticated,  isLoading } = useSelector((state)=>state.auth);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(checkAuth());
    },[dispatch])

    if(isLoading)
        return <Skeleton className="w-[800] bg-black h-[600px]" />
    
    // console.log(isLoading, user);
    return (
        <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
              ></CheckAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <Layout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <Admin_Layout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashbord />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

            {/* PayPal Routes (Outside CheckAuth) */}
            <Route path="/shop/paypal-return" element={<Paypal_Return1 />} />
            <Route path="/shop/paypal-cancel" element={<Paypal_Cancel />} />
            <Route path="/shop/payment-success" element={<Payment_Success />} />

          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShopingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShopingListing />} />
            <Route path="checkout" element={<ShopingCheckOut />} />
            <Route path="account" element={<ShopingAccount />} />
            <Route path="search" element={<Search />} />
          </Route>
          <Route path="/unauth-page" element={<UnAuth_Page />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    );
};

export default App;


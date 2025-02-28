import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./pages/home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import DetailProduct from "./pages/detail";
import AllProduct from "./pages/allSP";
import ProductToCategory from "./pages/spTheoLoaiSP";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import MyCart from "./pages/cart";
import WishList from "./pages/wishList";
import Account from "./pages/account";
import Checkout from "./pages/checkout";
import QuaySoTrungThuong from "./pages/quaySo";
import CauHoiThuongGap from "./pages/cauHoiThuongGap";


const Layout = () => {
  return (

    <div className='layout-app'>
        <Header />
        <Outlet />
        <Footer />
    </div>
  )
}

export default function App() {


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      children: [
        {
          index: true, 
          element: 
            <Home />,
          errorElement: <NotFound />,
        },
        {
          path: "detail-product",
          element: 
            <DetailProduct />,
          errorElement: <NotFound />,
        },
        {
          path: "all-product",
          element: 
            <AllProduct />,
          errorElement: <NotFound />,
        },
        {
          path: "all-product-category",
          element: 
            <ProductToCategory />,
          errorElement: <NotFound />,
        },
        {
          path: "mycart",
          element: 
            <MyCart />,
          errorElement: <NotFound />,
        }, 
        {
          path: "wishlist",
          element: 
            <WishList />,
          errorElement: <NotFound />,
        }, 
        {
          path: "myaccount",
          element: 
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>,
          errorElement: <NotFound />,
        }, 
        {
          path: "checkout",
          element: 
            <Checkout />,
          errorElement: <NotFound />,
        }, 
        {
          path: "quayso",
          element: 
            <QuaySoTrungThuong />,
          errorElement: <NotFound />,
        }, 
        {
          path: "cauhoithuonggap",
          element: 
            <CauHoiThuongGap />,
          errorElement: <NotFound />,
        }, 
        {
          path: "login-web",
          element: <Login />,
          errorElement: <NotFound />,
        },
        {
          path: "register-web",
          element: <Register />,
          errorElement: <NotFound />,
        },   
      ],
    },

    // {
    //   path: "/",
    //   element: <Layout />,
    //   errorElement: <NotFound />,

    //   children: [
    //     {
    //       index: true, 
    //       element: 
    //       <ProtectedRoute>
    //         <Home />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     },
    //     {
    //       path: "detail-product",
    //       element: 
    //       <ProtectedRoute>
    //         <DetailProduct />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     },
    //     {
    //       path: "all-product",
    //       element: 
    //       <ProtectedRoute>
    //         <AllProduct />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     },
    //     {
    //       path: "all-product-category",
    //       element: 
    //       <ProtectedRoute>
    //         <ProductToCategory />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     },
    //     {
    //       path: "mycart",
    //       element: 
    //       <ProtectedRoute>
    //         <MyCart />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     }, 
    //     {
    //       path: "wishlist",
    //       element: 
    //       <ProtectedRoute>
    //         <WishList />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     }, 
    //     {
    //       path: "myaccount",
    //       element: 
    //       <ProtectedRoute>
    //         <Account />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     }, 
    //     {
    //       path: "checkout",
    //       element: 
    //       <ProtectedRoute>
    //         <Checkout />
    //       </ProtectedRoute>,
    //       errorElement: <NotFound />,
    //     }, 
    //     {
    //       path: "login-web",
    //       element: <Login />,
    //       errorElement: <NotFound />,
    //     },
    //     {
    //       path: "register-web",
    //       element: <Register />,
    //       errorElement: <NotFound />,
    //     },   
    //   ],
    // },
    
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
import SearchInput from '../Search/Search'
import logoTop from '/assets/images/logo-kttt.png'
import iconBaGach from '../../assets/images/icons/14.svg'
import { useDispatch, useSelector } from 'react-redux'
import { fetchListHangSX } from '../../redux/HangSX/hangSXSlice'
import { fetchListCategory } from '../../redux/TheLoai/theLoaiSlice'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchMobile from '../Search/SearchMobile'
import { BiLogIn } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { handleLogout } from '../../services/loginKHAPI'
import { Button, Col, message, Row } from 'antd'
import { doLogoutAction } from '../../redux/accKH/accountSlice'
import { doDeleteItemCartAction, doLogoutActionCart } from '../../redux/order/orderSlice'
import { doLogoutActionWishlist } from '../../redux/wishlist/wishlistSlice'

const Header = () => {

    const dispatch = useDispatch()
    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    const dataHangSX = useSelector(state => state.hangSX.listHangSXs.data)
    const isAuthenticated = useSelector((state) => state.accountKH.isAuthenticated);
    const order = useSelector((state) => state.order);
    const wishList = useSelector((state) => state.wishlist.Wishlist);
    console.log("isAuthenticated: ", isAuthenticated);
    console.log("order: ", order);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryMobile, setSearchQueryMobile] = useState('');
    const navigate = useNavigate()

    const location = useLocation();  // Lấy thông tin location hiện tại
    const queryParams = new URLSearchParams(location.search);
    let idLoaiSP = queryParams.get('IdLoaiSP')    
        
    const customerId = useSelector(state => state.accountKH.user._id)
    const user = useSelector(state => state.accountKH.user)
    
    const handleSearchChange = (query) => {
      setSearchQuery(query);      
  
      if (typeof query === 'string') {
        // Tạo URLSearchParams từ query string hiện tại
        const searchParams = new URLSearchParams(location.search);
  
        // Cập nhật lại query parameter 'TenSP'
        searchParams.set('TenSP', query);
  
        // Nếu 'IdLoaiSP' đã có trong query params, giữ nguyên nó
        if (idLoaiSP) {
          searchParams.set('IdLoaiSP', idLoaiSP);  // Giữ 'IdLoaiSP' trong query string
        }

        if(location.pathname === '/mycart' || location.pathname === '/wishlist' || location.pathname === '/myaccount' 
          || location.pathname === '/checkout'){
          navigate(`/all-product?${searchParams.toString()}`);
          // Cuộn về đầu trang
          window.scrollTo({ top: 500, behavior: 'smooth' });
        } else {
          // Otherwise, update the current URL with the new query string
          navigate(`${location.pathname}?${searchParams.toString()}`);
          // Cuộn về đầu trang
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }
  
        // Điều hướng tới URL mới với 'TenSP' và 'IdLoaiSP'
        // navigate(`${location.pathname}?${searchParams.toString()}`);
      }
    };

    const handleSearchChange1 = (query) => {
      setSearchQuery(query);      
      // Kiểm tra giá trị của query để đảm bảo nó là chuỗi
      if (typeof query === 'string') {
        if (window.location.pathname === "/") {
          navigate(`/?TenSP=${encodeURIComponent(query)}`); // Nếu đang ở trang home
        } else if (window.location.pathname === "/all-product") {
          navigate(`/all-product?TenSP=${encodeURIComponent(query)}`); // Nếu đang ở trang all-product
        } else if (window.location.pathname === `/all-product-category?IdLoaiSP=${idLoaiSP}`) {
          navigate(`/all-product-category?IdLoaiSP=${idLoaiSP}&TenSP=${encodeURIComponent(query)}`); // Nếu đang ở trang all-product
        } 
      }
    };
    const handleSearchChangeMobile = (query) => {
      setSearchQuery(query);      
  
      if (typeof query === 'string') {
        // Tạo URLSearchParams từ query string hiện tại
        const searchParams = new URLSearchParams(location.search);
  
        // Cập nhật lại query parameter 'TenSP'
        searchParams.set('TenSP', query);
  
        // Nếu 'IdLoaiSP' đã có trong query params, giữ nguyên nó
        if (idLoaiSP) {
          searchParams.set('IdLoaiSP', idLoaiSP);  // Giữ 'IdLoaiSP' trong query string
        }

        if(location.pathname === '/mycart' || location.pathname === '/wishlist' || location.pathname === '/myaccount' 
          || location.pathname === '/checkout'){
          navigate(`/all-product?${searchParams.toString()}`);
          // Cuộn về đầu trang
          window.scrollTo({ top: 600, behavior: 'smooth' });
        } else {
          // Otherwise, update the current URL with the new query string
          navigate(`${location.pathname}?${searchParams.toString()}`);
          // Cuộn về đầu trang
          window.scrollTo({ top: 1880, behavior: 'smooth' });
        }
  
        // Điều hướng tới URL mới với 'TenSP' và 'IdLoaiSP'
        // navigate(`${location.pathname}?${searchParams.toString()}`);
      }
    };
    
    const logoutClick = async () => {
        const res = await handleLogout()
        if(res) {
          dispatch(doLogoutAction())
          dispatch(doLogoutActionCart())
          dispatch(doLogoutActionWishlist())
          message.success(res.message)
          navigate('/')
        }
    }

    useEffect(() => {
      dispatch(fetchListHangSX())
      dispatch(fetchListCategory())
    }, [dispatch])
   
    const handleRedirectLayIdDeXemDetailPageUrl = (item) => {
      console.log("id: ", item);
      // Lấy các _id từ mảng idLoaiSP và chuyển thành chuỗi
      const idLoaiSPString = item.IdLoaiSP.map(loai => loai._id).join(',');
      window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`
      // navigate(`/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`)
    }

    const deleteCartAProduct = (productId, size) => {
      console.log("productId, size: ", productId, size);
      
      dispatch(doDeleteItemCartAction({productId, size, customerId}))
    }

    
    return (
      <>
          <div className="rts-header-one-area-one">
            <div className="header-top-area bg_primary">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="bwtween-area-header-top header-top-style-four">
                      <div className="hader-top-menu">
                        {/* <a href="#">About Us</a>
                        <a href="#">My Account </a>
                        <a href="#">Wishlist</a>
                        <a href="#">Order Tracking</a> */}
                      </div>
                      {/* <p class="marquee-text">Chào mừng bạn {user.fullName} đến với&nbsp;WebShop Khắc Tú!</p> */}
                      {!isAuthenticated ? 
                      <>
                        <p class="marquee-text">Hãy đăng ký tài khoản để nhận ngay 1 lượt quay số trúng thưởng 🧧</p>
                        <div className="follow-us-social" style={{cursor: "pointer"}} onClick={() => navigate('/login-web')}>
                          <BiLogIn size={25} style={{color: "white"}} /> &nbsp;&nbsp;
                          <span>Đăng nhập</span>                      
                        </div>
                      </> 
                      : 
                      <>
                        <p class="marquee-text">Chào mừng bạn {user.fullName} đến với&nbsp;Tigarboardgame! &nbsp;&nbsp; 
                          {/* {user.quayMayManCount > 0 ? <><span>Bạn đang có {user.quayMayManCount} lượt quay số trúng thưởng</span></> : ''} */}
                        </p>
                        {/* <p class="marquee-text">Số người đang online: {onlineUsers}</p> */}
                        <div className="follow-us-social" style={{cursor: "pointer"}} onClick={() => logoutClick()}>
                          <MdLogout size={25} style={{color: "white"}} /> &nbsp;&nbsp;
                          <span>Đăng xuất</span>                      
                        </div>
                      </>}
                      

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="search-header-area-main-1">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="search-header-area-main bg_white without-category">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="logo-search-category-wrapper style-five-call-us">
                              <a onClick={() => navigate('/')} href='/' className="logo-area">
                                <img width={300} src={logoTop} alt="logo-main" className="logo" />
                              </a>
                              <div className="category-search-wrapper style-five">
                                <div className="location-area">
                                  <div className="icon">
                                    <i className="fa-regular fa-phone-volume" />
                                  </div>
                                  <div className="information">
                                    <span>Zalo</span>
                                    <a href="#"><p>092.616.9374</p></a>
                                  </div>
                                </div>
                                {/* search */}
                                <SearchInput value={searchQuery} onSearchChange={handleSearchChange} disabled={false} />
                                {/* {isAuthenticated === true ? 
                                <>
                                  <SearchInput value={searchQuery} onSearchChange={handleSearchChange} disabled={false} />
                                </> : 
                                <>
                                <SearchInput value={searchQuery} onSearchChange={handleSearchChange} disabled={true}  />
                                </>} */}
                                
                                </div>
                              <div className="accont-wishlist-cart-area-header">
                                {isAuthenticated === true ?   
                                  <a style={{cursor: "pointer"}} onClick={() => navigate('/myaccount')} className="btn-border-only account">
                                        <i className="fa-light fa-user" />
                                        Tài khoản
                                  </a> : ''}

                                  <a style={{cursor: "pointer"}} onClick={() => navigate('/wishlist')} className="btn-border-only wishlist">
                                  <i className="fa-regular fa-heart" />
                                  Yêu thích
                                  <span className="number">{wishList?.length}</span>
                                </a>

                                    <div className="btn-border-only cart category-hover-header" style={{zIndex: "101"}}>
                                        <i className="fa-sharp fa-regular fa-cart-shopping" />
                                        <span a onClick={() => navigate('/mycart')} className="text">Giỏ hàng</span>
                                        <span className="number">{order.totalQuantity}</span>

                                        <div className="category-sub-menu card-number-show">
                                          <h5 className="shopping-cart-number">Giỏ hàng đang có ({order.carts.length})</h5>
                                          {order.carts.length > 0 ? (
                                            <>
                                              {/* Render cart items */}
                                              {order.carts.map((item, index) => {
                                                return (
                                                  <div className="cart-item-1 border-top" key={item._id}>
                                                    <div className="img-name">
                                                      <div className="thumbanil">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.detail.Image}`} alt="" />
                                                      </div>
                                                      <div className="details">
                                                        <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item.detail)}>
                                                          <h5 className="title" style={{color: "#629D23"}}>{item.detail.TenSP}</h5>
                                                        </a>
                                                        <div className="number" style={{fontSize: "15px"}}>
                                                          Số lượng đặt: <span style={{color: "blue"}}>{item.quantity}</span>  <br/>                                                      
                                                        </div>
                                                        <span style={{marginTop: "10px"}}>Cấu hình: {item.sizeDaChon}</span>

                                                        {item.detail.GiamGiaSP !== 0 ? (
                                                          <p style={{color: "red", fontWeight: "500", marginTop: "10px"}}>
                                                            {Math.ceil(item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100))).toLocaleString()}đ
                                                            &nbsp;&nbsp;&nbsp;
                                                            <span style={{color: "gray", fontWeight: "500"}}>
                                                              <s>{item.priceDaChon.toLocaleString()}đ</s>
                                                            </span>
                                                          </p>                                                         
                                                        ) : (
                                                          <p style={{color: "red", fontWeight: "500", marginTop: "10px"}}>
                                                            {item.priceDaChon.toLocaleString()}đ
                                                          </p>
                                                        )}
                                                      </div>
                                                    </div>
                                                    <div className="close-c1" onClick={() => deleteCartAProduct(item._id, item.sizeDaChon)}>
                                                      <i className="fa-regular fa-x" />
                                                    </div>
                                                  </div>
                                                );
                                              })}

                                              
                                              <div className="sub-total-cart-balance">                                          
                                                <div className="button-wrapper d-flex align-items-center justify-content-between">
                                                  <a onClick={() => navigate('/mycart')} className="rts-btn btn-primary border-only">Xem chi tiết</a>
                                                  <a onClick={() => navigate('/checkout')} className="rts-btn btn-primary border-only">Đặt hàng</a>
                                                </div>
                                              </div>
                                            </>
                                          ) : (
                                            <p>Chưa có sản phẩm trong giỏ hàng</p>  
                                          )}

                                        </div>

                                        {/* <a  className="over_link" /> */}
                                    </div>
                                                                                          
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rts-header-nav-area-one header--sticky">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="nav-and-btn-wrapper">
                      <div className="nav-area-bottom-left-header-four">
                        <div className="category-btn category-hover-header five-style">
                          <img className="parent" src={iconBaGach} alt="icons" />
                          <span className="ml--10">Danh Mục</span>
                          <ul className="category-sub-menu" id="category-active-four">
                            {/* <li>
                              <a href="#" className="menu-item">
                                <img src="assets/images/icons/01.svg" alt="icons" />
                                <span>Breakfast &amp; Dairy</span>
                                <i className="fa-regular fa-plus" />
                              </a>
                              <ul className="submenu mm-collapse">
                                <li><a className="mobile-menu-link" href="#">Breakfast</a></li>
                                <li><a className="mobile-menu-link" href="#">Dinner</a></li>
                                <li><a className="mobile-menu-link" href="#"> Pumking</a></li>
                              </ul>
                            </li> */}
                            {dataTheLoai?.map((item, index) => {
                              return (
                                <li key={index}>
                                  {/* href={`/all-product-category?IdLoaiSP=${item._id}`} */}
                                  <a 
                                  onClick={() => {
                                    message.success(`Trang sản phẩm của ${item.TenLoaiSP}`)
                                    navigate(`/all-product-category?IdLoaiSP=${item._id}`)
                                  }} 
                                  className="menu-item"                                
                                  >
                                    <img width={50} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="icons" />
                                    <span>{item.TenLoaiSP}</span>
                                  </a>
                                </li>
                              )
                            })}
                            
                          
                          </ul>
                        </div>
                        <div className="nav-area">
                          <nav>
                            <ul className="parent-nav">
                              <li className={`parent has-dropdown`}>
                                <a className="nav-link" style={{cursor: "pointer", color: location.pathname === '/' ? "navy" : "black"}} href='/'>Trang chủ</a>                              
                              </li>


                              <li  className={`parent`}>
                                <a  className='thea' 
                                    style={{cursor: "pointer", 
                                      color: location.pathname === '/all-product' || location.pathname === '/all-product-category' ? "navy" : "black"
                                    }} href='/all-product'  onClick={() => navigate('/all-product')}>Sản phẩm</a>
                              </li>
                              <li className={`parent`}>
                                <a href='/quayso' style={{cursor: "pointer", color: location.pathname === '/quayso' ? "navy" : "black"}}>Quay số trúng thưởng</a>
                              </li>  

                              <li className={`parent`}>
                                <a href="/cauhoithuonggap" style={{cursor: "pointer", color: location.pathname === '/cauhoithuonggap' ? "navy" : "black"}}>Câu Hỏi Thường Gặp</a>
                              </li>

                            </ul>
                          </nav>
                        </div>
                      </div>
                      <div className="right-btn-area header-five">
                        {/* <a href="#" className="btn-narrow">Nhận ngay giảm giá</a> */}
                        <button className="rts-btn btn-primary">
                        Giảm giá
                          <span>Sale</span>
                        </button>
                      </div>
                      {/* button-area end */}
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="logo-search-category-wrapper after-md-device-header header-mid-five-call">
                      <a href="/" className="logo-area">
                        <img src={logoTop} alt="logo-main" className="logo" />
                      </a>
                      {/* <div className="category-search-wrapper">
                        
                        <form action="#" className="search-header">
                          <input type="text" placeholder="Search for products, categories or brands" required />
                          <button className="rts-btn btn-primary radious-sm with-icon">
                            <span className="btn-text">
                              Search
                            </span>
                            <span className="arrow-icon">
                              <i className="fa-light fa-magnifying-glass" />
                            </span>
                            <span className="arrow-icon">
                              <i className="fa-light fa-magnifying-glass" />
                            </span>
                          </button>
                        </form>
                      </div> */}
                      <div className="main-wrapper-action-2 d-flex">
                        <div className="accont-wishlist-cart-area-header">
                          <a href="/myaccount" className="btn-border-only account">
                            <i className="fa-light fa-user" />
                            Account
                          </a>
                          <a href="/wishlist" className="btn-border-only wishlist">
                            <i className="fa-regular fa-heart" />
                            Wishlist
                          </a>
                          <div className="btn-border-only cart category-hover-header">
                            <i className="fa-sharp fa-regular fa-cart-shopping" />
                            <span className="text">My Cart</span>
                            <span className="number">{order.totalQuantity}</span>

                            <div className="category-sub-menu card-number-show">
                              <h5 className="shopping-cart-number">Giỏ hàng đang có ({order.carts.length})</h5>
                              {order.carts.length > 0 ? (
                                <>
                                  {/* Render cart items */}
                                  {order.carts.map((item, index) => {
                                    return (
                                      <div className="cart-item-1 border-top" key={item._id}>
                                        <div className="img-name">
                                          <div className="thumbanil">
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.detail.Image}`} alt="" />
                                          </div>
                                          <div className="details">
                                            <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item.detail)}>
                                              <h5 className="title" style={{color: "#629D23"}}>{item.detail.TenSP}</h5>
                                            </a>
                                            <div className="number" style={{fontSize: "15px"}}>
                                              Số lượng đặt: <span style={{color: "blue"}}>{item.quantity}</span>  <br/>                                                      
                                            </div>
                                            <span style={{marginTop: "10px"}}>Cấu hình: {item.sizeDaChon}</span>

                                            {item.detail.GiamGiaSP !== 0 ? (
                                              <p style={{color: "red", fontWeight: "500", marginTop: "10px"}}>
                                                {Math.ceil(item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100))).toLocaleString()}đ
                                                &nbsp;&nbsp;&nbsp;
                                                <span style={{color: "gray", fontWeight: "500"}}>
                                                  <s>{item.priceDaChon.toLocaleString()}đ</s>
                                                </span>
                                              </p>                                                         
                                            ) : (
                                              <p style={{color: "red", fontWeight: "500", marginTop: "10px"}}>
                                                {item.priceDaChon.toLocaleString()}đ
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="close-c1" onClick={() => deleteCartAProduct(item._id, item.sizeDaChon)}>
                                          <i className="fa-regular fa-x" />
                                        </div>
                                      </div>
                                    );
                                  })}

                                  
                                  <div className="sub-total-cart-balance">                                          
                                    <div className="button-wrapper d-flex align-items-center justify-content-between">
                                      <a onClick={() => navigate('/mycart')} href='/mycart' className="rts-btn btn-primary border-only">Xem chi tiết</a>
                                      <a onClick={() => navigate('/checkout')} href='/checkout' className="rts-btn btn-primary border-only">Đặt hàng</a>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <p>Chưa có sản phẩm trong giỏ hàng</p>  
                              )}

                            </div>
                            {/* <a href="cart.html" className="over_link" /> */}
                          </div>
                        </div>
                        <div className="actions-area">
                          {/* <div className="search-btn" id="search">
                            <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.75 14.7188L11.5625 10.5312C12.4688 9.4375 12.9688 8.03125 12.9688 6.5C12.9688 2.9375 10.0312 0 6.46875 0C2.875 0 0 2.9375 0 6.5C0 10.0938 2.90625 13 6.46875 13C7.96875 13 9.375 12.5 10.5 11.5938L14.6875 15.7812C14.8438 15.9375 15.0312 16 15.25 16C15.4375 16 15.625 15.9375 15.75 15.7812C16.0625 15.5 16.0625 15.0312 15.75 14.7188ZM1.5 6.5C1.5 3.75 3.71875 1.5 6.5 1.5C9.25 1.5 11.5 3.75 11.5 6.5C11.5 9.28125 9.25 11.5 6.5 11.5C3.71875 11.5 1.5 9.28125 1.5 6.5Z" fill="#1F1F25" />
                            </svg>
                          </div> */}
                          <div className="menu-btn" id="menu-btn">
                            <svg width={20} height={16} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect y={14} width={20} height={2} fill="#1F1F25" />
                              <rect y={7} width={20} height={2} fill="#1F1F25" />
                              <rect width={20} height={2} fill="#1F1F25" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* header style two */}
          <div id="side-bar" className="side-bar header-two">
            <button className="close-icon-menu"><i className="far fa-times" /></button>
            {/* <SearchMobile value={searchQueryMobile} onSearchChange={handleSearchChangeMobile}/> */}
            <div className="mobile-menu-nav-area tab-nav-btn mt--20">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Menu</button>
                  <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Danh Mục</button>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabIndex={0}>
                  {/* mobile menu area start */}
                  <div className="mobile-menu-main">
                    <nav className="nav-main mainmenu-nav mt--30">
                      <ul className="mainmenu metismenu" id="mobile-menu-active">
                        <li >
                          <a  className='thea main' 
                                style={{cursor: "pointer", 
                                color: location.pathname === '/' ? "navy" : "gray"
                              }} 
                              onClick={() => navigate('/')} >Trang chủ</a>                          
                        </li>
                        <li><a href="#" className="main">Giới thiệu</a></li>                                                
                        <li >
                          <a  className='thea main' 
                                style={{cursor: "pointer", 
                                color: location.pathname === '/all-product' || location.pathname === '/all-product-category' ? "navy" : "gray"
                              }} 
                              onClick={() => navigate('/all-product')} >Sản phẩm</a>                          
                        </li>
                        <li >
                          <a  className='thea main' 
                                style={{cursor: "pointer", 
                                color: location.pathname === '/quayso' ? "navy" : "gray"
                              }} 
                              onClick={() => navigate('/quayso')} >Quay số trúng thưởng</a>                          
                        </li>
                        <li><a
                          className='thea main' 
                            style={{cursor: "pointer", 
                            color: location.pathname === '/cauhoithuonggap' ? "navy" : "gray"
                          }}
                          onClick={() => navigate('/cauhoithuonggap')} 
                        >Câu Hỏi Thường Gặp</a></li>
                        {!isAuthenticated ? 
                        <li><a href="/login-web" className="main">Đăng nhập</a></li> : 
                        <li><a onClick={() => logoutClick()} className="main">Đăng xuất</a></li>
                        }
                      </ul>
                    </nav>
                  </div>
                  {/* mobile menu area end */}
                </div>
                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabIndex={0}>
                  <div className="category-btn category-hover-header menu-category">
                    <ul className="category-sub-menu" id="category-active-menu">
                        {dataTheLoai?.map((item, index) => {
                          return (
                            <li key={index}>
                              {/* href={`/all-product-category?IdLoaiSP=${item._id}`} */}
                              <a 
                              onClick={() => {
                                message.success(`Trang sản phẩm của ${item.TenLoaiSP}`)
                                navigate(`/all-product-category?IdLoaiSP=${item._id}`)
                              }} 
                              className="menu-item"                                
                              >
                                <img width={50} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="icons" />
                                <span>{item.TenLoaiSP}</span>
                              </a>
                            </li>
                          )
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* button area wrapper start */}
            <div className="button-area-main-wrapper-menuy-sidebar mt--50">
              <div className="contact-area">
                <div className="phone">
                  <i className="fa-light fa-headset" />
                  <a href="#">0564 942 086</a>
                </div>
                <div className="phone">
                  <i className="fa-light fa-envelope" />
                  <a href="#">0564 942 086</a>
                </div>
              </div>
              {!isAuthenticated ? <>
                <div className="buton-area-bottom">
                  <Row gutter={[10,20]}>                    
                    <Col md={24} sm={24} xs={24}>
                    <Button style={{width: "200px", cursor: "pointer"}} className='btn-primary' size='large' href="/wishlist">Sản phẩm yêu thích</Button>
                    </Col>
                  </Row>                  
                </div>    
              </> : <>
                <div className="buton-area-bottom">
                  <Row gutter={[10,20]}>
                    <Col md={24} sm={24} xs={24}>
                      <Button style={{width: "200px", cursor: "pointer"}} className='btn-primary' size='large' href="/myaccount">Tài khoản của tôi</Button>                   
                    </Col>
                    <Col md={24} sm={24} xs={24}>
                    <Button style={{width: "200px", cursor: "pointer"}} className='btn-primary' size='large' href="/wishlist">Sản phẩm yêu thích</Button>
                    </Col>
                  </Row>
                  
                </div>              
              </>}
            </div>
            {/* button area wrapper end */}
          </div>
          {/* header style two End */}
      
      </>
    )
}
export default Header
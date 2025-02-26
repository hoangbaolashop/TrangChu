import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchListHangSX } from "../../redux/HangSX/hangSXSlice"
import { fetchListCategory } from "../../redux/TheLoai/theLoaiSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { fetchAllProduct, fetchAllProductToCategoryNoiBat, fetchSPDetail } from "../../services/productAPI"
import { IoWarningOutline } from "react-icons/io5";
import ModalViewDetail from "../../components/Modal/ModalViewDetail"
import './css.scss'
import { Button, Carousel, Col, Divider, Row } from "antd"
import { FaAnglesRight } from "react-icons/fa6";
import { checkProductAvailability, doAddAction } from "../../redux/order/orderSlice"
import { doAddActionWishlist } from "../../redux/wishlist/wishlistSlice"

	
const Home = () => {

    const dispatch = useDispatch()
    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    const dataHangSX = useSelector(state => state.hangSX.listHangSXs.data)
    const navigate = useNavigate()
    const [idLoaiSP, setIdLoaiSP] = useState('673730c0512ef5430a91a416')
    const [idDetail, setIdDetail] = useState('673730c0512ef5430a91a416')
    const [dataProductToCategory, setDataProductToCategory] = useState([])
    const [activeTabIndex, setActiveTabIndex] = useState(0); // Chỉ định tab mặc định là tab đầu tiên
    const [openDetail, setOpenDetail] = useState(false)
    const isAuthenticated = useSelector((state) => state.accountKH.isAuthenticated);


    const [dataSP, setDataSP] = useState([])
    const [dataDetailSP, setDataDetailSP] = useState(null)
    const [dataSPNew, setDataSPNew] = useState([])
    const [dataSPDanhGiaCaoNhat, setDataSPDanhGiaCaoNhat] = useState([])
    const [dataSPSoLuotBanCao, setDataSPSoLuotBanCao] = useState([])
    const [dataSPGiamGiaCao, setDataSPGiamGiaCao] = useState([])
    const [sortQuery, setSortQuery] = useState("sort=updatedAt");
    const [soLuotDanhGia, setSoLuotDanhGia] = useState(10);
    const [soLuotBan, setSoLuotBan] = useState(10);
    const [giamGiaCao, setGiamGiaCao] = useState(20);
    const [sortQueryNew, setSortQueryNew] = useState("sort=updatedAt");
    const [orderQuery, setOrderQuery] = useState("order=asc"); // Thêm biến order cho sắp xếp desc-giamdan/ asc-tangdan
    const [orderQueryNew, setOrderQueryNew] = useState("order=desc"); // Thêm biến order cho sắp xếp desc-giamdan/ asc-tangdan
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [tenSP, setTenSP] = useState(queryParams.get('TenSP') || '');

    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [discountCode, setDiscountCode] = useState("MAVOUCHER");  // Mã giảm giá
    const customerId = useSelector(state => state.accountKH.user._id)

    const handleAddToCart = (product, giaChon, sizeChon) => {  // Thêm async ở đây để có thể sử dụng await bên trong
      console.log("product, giaChon, sizeChon, currentQuantity:", product, giaChon, sizeChon, currentQuantity);
  
        // Hàm kiểm tra số lượng sản phẩm, trả về một Promise
      const handleAddToCartt = () => {
          // Truyền thông tin sản phẩm vào checkProductAvailability
          return dispatch(checkProductAvailability({ dataDetailSP: product, selectedSize: sizeChon, currentQuantity }))
              .then(availability => {
                  console.log("availability: ", availability);

                  // Kiểm tra nếu không có đủ số lượng sản phẩm
                  if (!availability.payload) {
                      console.log("Sản phẩm không đủ số lượng");
                      return false;  // Nếu không đủ số lượng, trả về false
                  }

                  console.log("Số lượng đủ, tiếp tục thêm vào giỏ hàng");
                  return true;  // Nếu đủ số lượng, trả về true
              })
              .catch(error => {
                  console.error("Error checking availability:", error);
                  return false;  // Nếu có lỗi xảy ra, trả về false
              });
      };

      // Sử dụng .then() để xử lý kết quả từ handleAddToCartt
      handleAddToCartt()
      .then(isAvailable => {
          if (!isAvailable) {
              console.log("Không thể thêm sản phẩm vào giỏ hàng do số lượng không đủ");
              return;
          }

          // Nếu số lượng đủ, tiếp tục dispatch hành động thêm vào giỏ hàng
          dispatch(doAddAction({ dataDetailSP: product, currentQuantity, discountCode, customerId, selectedItemss: giaChon, selectedSize: sizeChon }));
      })
      .catch(error => {
          console.error("Có lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      });
  
      // dispatch(doAddAction({ dataDetailSP: product, currentQuantity, discountCode, customerId, selectedItemss: giaChon, selectedSize: sizeChon }));
    };

    const handleAddToCart1 = (product, giaChon, sizeChon) => {
      console.log("product, giaChon, sizeChon, currentQuantity:",product, giaChon, sizeChon, currentQuantity );
          
      dispatch(doAddAction({ dataDetailSP: product, currentQuantity, discountCode, customerId, selectedItemss: giaChon, selectedSize: sizeChon }));
    };

    const handleAddWishList = (product, giaChon, sizeChon) => {
      console.log("product, giaChon, sizeChon, currentQuantity:",product, giaChon, sizeChon, currentQuantity );
          
      dispatch(doAddActionWishlist({ dataDetailSP: product, customerId, selectedItemss: giaChon, selectedSize: sizeChon }));
    };

    // Cập nhật lại TenSP nếu queryParams thay đổi
    useEffect(() => {
      setTenSP(queryParams.get('TenSP') || '');
    }, [location]);

    const handleFindProductToCategory = async () => {
      let query = ''
      // Kiểm tra nếu idLoaiSP là mảng hoặc một giá trị đơn
      const idLoaiSPArray = Array.isArray(idLoaiSP) ? idLoaiSP : [idLoaiSP];  // Nếu không phải mảng, chuyển thành mảng

      if (idLoaiSPArray.length > 0) {
        query += `IdLoaiSP=${idLoaiSPArray.join(',')}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
      }
      const res = await fetchAllProductToCategoryNoiBat(query)
      console.log("res sp: ", res);      
      if (res && res.data && res.data.length > 0) {
        // Nếu có sản phẩm thì cập nhật lại state
        setDataProductToCategory(res.data);
      } else {
        // Nếu không có sản phẩm, sẽ không cần làm gì nữa
        setDataProductToCategory([]);
      }
    }

    const fetchListSP = async () => {
      let query = `page=1&limit=48`     

      if (tenSP) {
        query += `&TenSP=${encodeURIComponent(tenSP)}`;
      }  
      if (sortQuery) {
          query += `&${sortQuery}`;
      } 
      // Thêm tham số order nếu có
      if (orderQuery) {
          query += `&${orderQuery}`;
      }
  
      const res = await fetchAllProduct(query)
      console.log("res TL: ", res);
      if (res && res.data) {
          setDataSP(res.data)
      }
    }

    const fetchListSPMoiNhat = async () => {
      let query = `page=1&limit=50`
      
      if (sortQueryNew) {
          query += `&${sortQueryNew}`;
      } 
      // Thêm tham số order nếu có
      if (orderQueryNew) {
        query += `&${orderQueryNew}`;
      }
  
      const res = await fetchAllProduct(query)
      console.log("res TL: ", res);
      if (res && res.data) {
          setDataSPNew(res.data)
      }
    }

    const fetchListSPDanhGiaCaoNhat = async () => {
      let query = `SoLuotDanhGia=${soLuotDanhGia}`      
  
      const res = await fetchAllProduct(query)
      console.log("res TL: ", res);
      if (res && res.data) {
          setDataSPDanhGiaCaoNhat(res.data)
      }
    }

    const fetchListSPBanChayNhat = async () => {
      let query = `SoLuotBan=${soLuotBan}`      
  
      const res = await fetchAllProduct(query)
      console.log("res TL: ", res);
      if (res && res.data) {
          setDataSPSoLuotBanCao(res.data)
      }
    }

    const fetchListSPGiamGiaCao = async () => {
      let query = `GiamGiaSP=${giamGiaCao}`      
  
      const res = await fetchAllProduct(query)
      console.log("res TL: ", res);
      if (res && res.data) {
        setDataSPGiamGiaCao(res.data)
      }
    }

    const fetchProductDetail= async () => {  
      if (!dataDetailSP) { // Chỉ fetch khi dataDetailSP chưa có dữ liệu
        const res = await fetchSPDetail(idDetail);
        console.log("res TL: ", res);
        if (res && res.data) {
          setDataDetailSP(res.data);
        }
      }
    }    

    useEffect(() => {
      fetchProductDetail()
    }, [idDetail])

    useEffect(() => {
      fetchListSPGiamGiaCao()
    }, [giamGiaCao])

    useEffect(() => {
      fetchListSPBanChayNhat()
    }, [soLuotBan])

    useEffect(() => {
      fetchListSPDanhGiaCaoNhat()
    }, [soLuotDanhGia])

    useEffect(() => {
      fetchListSPMoiNhat()
    }, [sortQueryNew, orderQueryNew])

    useEffect(() => {
      fetchListSP()
    }, [tenSP, sortQuery, orderQuery])

    useEffect(() => {
        handleFindProductToCategory()
    }, [idLoaiSP])

    useEffect(() => {
      dispatch(fetchListHangSX())
      dispatch(fetchListCategory())
    }, [])


    
    const handleRedirectSpTheoLoai = (item) => {
      console.log("id: ", item);
      setIdLoaiSP(item)
    }
    const handleRedirectLayIdDeXemDetail = (item) => {
      console.log("id: ", item);
      setIdDetail(item)
    }

    const handleRedirectLayIdDeXemDetailPageUrl = (item) => {
      console.log("id: ", item);
      // Lấy các _id từ mảng idLoaiSP và chuyển thành chuỗi
      const idLoaiSPString = item.IdLoaiSP.map(loai => loai._id).join(',');
      // navigate(`/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`)
      window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`
    }


    // useEffect(() => {
    //   // Giới hạn chiều cao của phần cuộn
    //   const containerHeight = 350; // Bạn có thể thay đổi chiều cao này theo nhu cầu của mình.
    //   const productHeight = 100; // Chiều cao mỗi sản phẩm
    //   const totalHeight = dataSPNew.length * productHeight; // Tổng chiều cao của tất cả các sản phẩm

    //   const interval = setInterval(() => {
    //     // Tính toán vị trí cuộn tiếp theo
    //     if (offset < totalHeight - containerHeight) {
    //       setOffset(offset + productHeight); // Cuộn lên một sản phẩm
    //     } else {
    //       setOffset(0); // Nếu hết thì quay lại từ đầu
    //     }
    //   }, 3000); // Mỗi 3 giây cuộn một lần

    //   return () => clearInterval(interval); // Dọn dẹp khi component bị unmount
    // }, [offset, dataSPNew]);
    const [offsetColumn1, setOffsetColumn1] = useState(0); // offset cho cột 1
    const [offsetColumn2, setOffsetColumn2] = useState(0); // offset cho cột 2
    const [offsetColumn3, setOffsetColumn3] = useState(0); // offset cho cột 2
    const [offsetColumn4, setOffsetColumn4] = useState(0); // offset cho cột 2

    useEffect(() => {
      // Các tham số liên quan đến cuộn cho mỗi cột
      const interval1 = setInterval(() => {
        if (offsetColumn1 < dataSPNew.length * 100 - 500) {
          setOffsetColumn1(offsetColumn1 + 100); // Cuộn lên 1 sản phẩm cho cột 1
        } else {
          setOffsetColumn1(0); // Quay lại đầu khi hết sản phẩm
        }
      }, 2000); // Mỗi 3 giây cuộn 1 lần cho cột 1

      const interval2 = setInterval(() => {
        if (offsetColumn2 < dataSPDanhGiaCaoNhat.length * 100 - 500) {
          setOffsetColumn2(offsetColumn2 + 100); // Cuộn lên 1 sản phẩm cho cột 2
        } else {
          setOffsetColumn2(0); // Quay lại đầu khi hết sản phẩm
        }
      }, 2000); // Mỗi 3 giây cuộn 1 lần cho cột 2

      const interval3 = setInterval(() => {
        if (offsetColumn3 < dataSPSoLuotBanCao.length * 100 - 500) {
          setOffsetColumn3(offsetColumn3 + 100); // Cuộn lên 1 sản phẩm cho cột 3
        } else {
          setOffsetColumn3(0); // Quay lại đầu khi hết sản phẩm
        }
      }, 2000); // Mỗi 3 giây cuộn 1 lần cho cột 3

      const interval4 = setInterval(() => {
        if (offsetColumn4 < dataSPSoLuotBanCao.length * 100 - 500) {
          setOffsetColumn4(offsetColumn4 + 100); // Cuộn lên 1 sản phẩm cho cột 4
        } else {
          setOffsetColumn4(0); // Quay lại đầu khi hết sản phẩm
        }
      }, 2000); // Mỗi 3 giây cuộn 1 lần cho cột 3

      return () => {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);
        clearInterval(interval4);
      };
    }, [offsetColumn1, offsetColumn2, offsetColumn3, offsetColumn4, dataSPNew, dataSPDanhGiaCaoNhat]);

    return (
        <>        
          {/* rts banner areaas tart */}
          <div className="background-light-gray-color rts-section-gap bg_light-1 pt_sm--20">
            {/* rts banner area start */}
            <div className="rts-banner-area-one mb--30">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="category-area-main-wrapper-one">
                      <div className="swiper mySwiper-category-1 swiper-data" data-swiper="{
                                    &quot;spaceBetween&quot;:1,
                                    &quot;slidesPerView&quot;:1,
                                    &quot;loop&quot;: true,
                                    &quot;speed&quot;: 2000,
                                    &quot;autoplay&quot;:{
                                        &quot;delay&quot;:&quot;4000&quot;
                                    },
                                    &quot;navigation&quot;:{
                                        &quot;nextEl&quot;:&quot;.swiper-button-next&quot;,
                                        &quot;prevEl&quot;:&quot;.swiper-button-prev&quot;
                                    },
                                    &quot;breakpoints&quot;:{
                                    &quot;0&quot;:{
                                        &quot;slidesPerView&quot;:1,
                                        &quot;spaceBetween&quot;: 0},
                                    &quot;320&quot;:{
                                        &quot;slidesPerView&quot;:1,
                                        &quot;spaceBetween&quot;:0},
                                    &quot;480&quot;:{
                                        &quot;slidesPerView&quot;:1,
                                        &quot;spaceBetween&quot;:0},
                                    &quot;640&quot;:{
                                        &quot;slidesPerView&quot;:1,
                                        &quot;spaceBetween&quot;:0},
                                    &quot;840&quot;:{
                                        &quot;slidesPerView&quot;:1,
                                        &quot;spaceBetween&quot;:0},
                                    &quot;1140&quot;:{
                                        &quot;slidesPerView&quot;:1,
                                        &quot;spaceBetween&quot;:0}
                                    }
                                }">
                        <div className="swiper-wrapper">
                          {/* single swiper start */}
                          <div className="swiper-slide">
                            <div className="banner-bg-image bg_image bg_one-banner  ptb--120 ptb_md--80 ptb_sm--60">
                              <div className="banner-one-inner-content">
                                <h1 className="title"><br/><br/></h1>  
                              </div>
                            </div>
                          </div>
                          {/* single swiper start */}
                          {/* single swiper start */}
                          <div className="swiper-slide">
                            <div className="banner-bg-image bg_image bg_one-banner two  ptb--120 ptb_md--80 ptb_sm--60">
                              <div className="banner-one-inner-content">
                                <h1 className="title"><br/><br/></h1>                     
                              </div>
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="banner-bg-image bg_image bg_one-banner three  ptb--120 ptb_md--80 ptb_sm--60">
                              <div className="banner-one-inner-content">
                                <h1 className="title"><br/><br/></h1>                     
                              </div>
                            </div>
                          </div>
                          {/* single swiper start */}
                        </div>
                        <button className="swiper-button-next"><i className="fa-regular fa-arrow-right" /></button>
                        <button className="swiper-button-prev"><i className="fa-regular fa-arrow-left" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* rts banner area end */}

          </div>
          {/* rts banner areaas end */}

     

       {/* rts categorya area start */}
       <div className="rts-category-area rts-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="cover-card-main-over-white">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="title-area-between">
                      <h2 className="title-left mb--0">
                        Danh mục thể loại
                      </h2>
                      <div className="next-prev-swiper-wrapper">
                        <div className="swiper-button-prev"><i className="fa-regular fa-chevron-left" /></div>
                        <div className="swiper-button-next"><i className="fa-regular fa-chevron-right" /></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    {/* rts category area satart */}
                    <div className="rts-caregory-area-one ">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="category-area-main-wrapper-one">
                            <div className="swiper mySwiper-category-1 swiper-data" data-swiper="{
                                                    &quot;spaceBetween&quot;:15,
                                                    &quot;slidesPerView&quot;:8,
                                                    &quot;loop&quot;: true,
                                                    &quot;speed&quot;: 1000,
                                                    &quot;navigation&quot;:{
                                                        &quot;nextEl&quot;:&quot;.swiper-button-next&quot;,
                                                        &quot;prevEl&quot;:&quot;.swiper-button-prev&quot;
                                                        },
                                                    &quot;breakpoints&quot;:{
                                                    &quot;0&quot;:{
                                                        &quot;slidesPerView&quot;:1,
                                                        &quot;spaceBetween&quot;: 15},
                                                    &quot;380&quot;:{
                                                        &quot;slidesPerView&quot;:2,
                                                        &quot;spaceBetween&quot;:15},
                                                    &quot;480&quot;:{
                                                        &quot;slidesPerView&quot;:3,
                                                        &quot;spaceBetween&quot;:15},
                                                    &quot;640&quot;:{
                                                        &quot;slidesPerView&quot;:4,
                                                        &quot;spaceBetween&quot;:15},
                                                    &quot;840&quot;:{
                                                        &quot;slidesPerView&quot;:6,
                                                        &quot;spaceBetween&quot;:15},
                                                    &quot;1140&quot;:{
                                                        &quot;slidesPerView&quot;:8,
                                                        &quot;spaceBetween&quot;:15}
                                                    }
                                                }">
                              <div className="swiper-wrapper">

                                {/* single swiper start */}
                                {dataTheLoai?.map((item, index) => {
                                  return (
                                    <div className="swiper-slide" key={index} onClick={() => {
                                      // Cuộn về đầu trang
                                      // window.location.href = `/all-product-category?IdLoaiSP=${item._id}`
                                      navigate(`/all-product-category?IdLoaiSP=${item._id}`);
                                      window.scrollTo({ top: 600, behavior: 'smooth' });
                                      }}>
                                      <div className="single-category-one height-230">
                                        <a 
                                        onClick={() => {
                                          // Cuộn về đầu trang
                                          // window.location.href = `/all-product-category?IdLoaiSP=${item._id}`
                                          navigate(`/all-product-category?IdLoaiSP=${item._id}`);
                                          window.scrollTo({ top: 600, behavior: 'smooth' });
                                          }}
                                        // href={`/all-product-category?IdLoaiSP=${item._id}`} 
                                        className="thumbnail">
                                          <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="category" />
                                        </a>
                                        <div className="inner-content-category">
                                          <p>{item.TenLoaiSP}</p>
                                          <span>{item.totalProducts} sản phẩm</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                                {/* single swiper start */}
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* rts category area end */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* rts categorya area end */}

    

      {/* popular -product wrapper 7 */}
      <div className="popular-product-col-7-area rts-section-gapBottom ">
        <div className="container cover-card-main-over-white mt--60 ">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-area-between mb--15" style={{justifyContent: "center"}}>
                <h2 className="title-left" style={{color: "navy"}}>
                Sản phẩm trong cửa hàng
                </h2>               
              </div>
            </div>
          </div>
          <div className="row plr--30 plr_sm--5">
            <div className="col-lg-12">
              <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id={`home`} role="tabpanel" aria-labelledby={`home-tab`}>
                      <div className="row g-4 mt--0">
                      {dataSP.length === 0 ? (
                        <div className="col-12">
                          <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                          <IoWarningOutline size={100} />
                            Chưa có sản phẩm nào cả! </p>
                        </div>
                      ) : (
                        dataSP?.map((item, index) => {
                          return (
                            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                              <div className="single-shopping-card-one deals-of-day"  style={{height: "520px"}}>
                                <div className="image-and-action-area-wrapper">
                                  <a className="thumbnail-preview">
                                    {item.GiamGiaSP !== 0 ? 
                                    <>
                                    <div className="badge" style={{color: "red"}}>
                                        <span style={{color: "white"}}>-{item.GiamGiaSP}% <br/> 
                                            Sale
                                        </span>
                                        <i style={{color: "red"}} className="fa-solid fa-bookmark"></i>
                                    </div>
                                    </> 
                                    : <></>}                                    
                                    <img style={{height: "220px"}} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="grocery" />
                                  </a>
                                  <div className="action-share-option">
                                    <div onClick={() => handleAddWishList(item, item.sizes[0].price, item.sizes[0].size)} className="single-action openuptip message-show-action" data-flow="up" title="Danh sách yêu thích">
                                      <i className="fa-light fa-heart" />
                                    </div>
                                    {/* <div className="single-action openuptip" data-flow="up" title="Compare" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                      <i className="fa-solid fa-arrows-retweet" />
                                    </div> */}
                                     &nbsp;
                                     &nbsp;
                                    <div 
                                      className="single-action openuptip cta-quickview product-details-popup-btn" 
                                      onClick={() => {
                                        setOpenDetail(true)
                                        handleRedirectLayIdDeXemDetail(item._id)
                                      }} 
                                      data-flow="up" 
                                      data-bs-target="#exampleModal1" 
                                      title="Xem chi tiết">
                                      <i className="fa-regular fa-eye" />
                                    </div>
                                  </div>
                                </div>
                                <div className="body-content">
                                  <div className="start-area-rating">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                  </div>
                                  <span className="availability">{item.IdHangSX?.TenHangSX}</span> <br/><br/>
                                  <a>
                                    <h4 className="title" onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)}>{item.TenSP}</h4>
                                  </a>
                                  {/* <span className="availability">500g Pack</span> */}
                                  <div className="price-area">
                                    <span className="current">
                                      {/* {(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ */}
                                      {Math.ceil(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ
                                    </span>                                    {item.GiamGiaSP !== 0 ? 
                                    <>
                                    <div className="previous">{item.sizes[0].price.toLocaleString()}đ</div>
                                    </> : 
                                    <>
                                    <div className="previous"></div>
                                    </>}
                                  </div>
                                  <div className="cart-counter-action css-btn">
                                    <a onClick={() => handleAddToCart(item, item.sizes[0].price, item.sizes[0].size)} className="rts-btn btn-primary radious-sm with-icon">
                                      <div className="btn-text">
                                      Thêm vào giỏ hàng
                                      </div>
                                      <div className="arrow-icon">
                                        <i className="fa-regular fa-cart-shopping" />
                                      </div>
                                      <div className="arrow-icon">
                                        <i className="fa-regular fa-cart-shopping" />
                                      </div>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}

                      <Row>
                        <Col span={24} style={{textAlign: "center"}}>
                          <Button style={{
                            width: "200px",
                          }} size="large" type="primary" icon={<FaAnglesRight />} onClick={() => window.location.href = '/all-product'}>Xem Thêm</Button>
                        </Col>
                      </Row>
                      </div>
                    </div>                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="popular-product-col-7-area rts-section-gapBottom">
        <div className="container cover-card-main-over-white mt--60 ">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-area-between mb--15">
                <h2 className="title-left">
                Sản phẩm nổi bật
                </h2>
                <ul className="nav nav-tabs best-selling-grocery" id="myTab" role="tablist">
                  {dataTheLoai?.map((item, index) => {
                    return (
                      <li className="nav-item" role="presentation" key={index}>
                        <button 
                          onClick={() => {
                            setActiveTabIndex(index); // Cập nhật tab active
                            handleRedirectSpTheoLoai(item._id); // Gọi hàm xử lý khi click
                          }}
                          className={`nav-link ${activeTabIndex === index ? 'active' : ''}`}
                          id={`home-tab${index}`} data-bs-toggle="tab" 
                          data-bs-target={`#home${index}`} type="button" role="tab" aria-controls={`home${index}`} 
                          aria-selected={activeTabIndex === index ? 'true' : 'false'}
                        >{item.TenLoaiSP}</button>
                      </li>
                    )
                  })}                  
                </ul>
              </div>
            </div>
          </div>
          <div className="row plr--30 plr_sm--5">
            <div className="col-lg-12">
              <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id={`home`} role="tabpanel" aria-labelledby={`home-tab`}>
                      <div className="row g-4 mt--0">
                      {dataProductToCategory.length === 0 ? (
                        <div className="col-12">
                          <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                          <IoWarningOutline size={100} />
                            Chưa có sản phẩm nào cả! </p>
                        </div>
                      ) : (
                        dataProductToCategory?.map((item, index) => {
                          return (
                            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                              <div className="single-shopping-card-one deals-of-day" style={{height: "520px"}}>
                                <div className="image-and-action-area-wrapper">
                                  <a className="thumbnail-preview">
                                    {item.GiamGiaSP !== 0 ? 
                                    <>
                                    <div className="badge" style={{color: "red"}}>
                                        <span style={{color: "white"}}>-{item.GiamGiaSP}% <br/> 
                                            Sale
                                        </span>
                                        <i style={{color: "red"}} className="fa-solid fa-bookmark"></i>
                                    </div>
                                    </> 
                                    : <></>}
                                    <img style={{height: "240px"}} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="grocery" />
                                  </a>
                                  <div className="action-share-option">
                                    <div onClick={() => handleAddWishList(item, item.sizes[0].price, item.sizes[0].size)} className="single-action openuptip message-show-action" data-flow="up" title="Add To Wishlist">
                                      <i className="fa-light fa-heart" />
                                    </div>
                                    <div className="single-action openuptip" data-flow="up" title="Compare" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                      <i className="fa-solid fa-arrows-retweet" />
                                    </div>
                                    <div className="single-action openuptip cta-quickview product-details-popup-btn" 
                                    onClick={() => {
                                      handleRedirectLayIdDeXemDetail(item._id)
                                      setOpenDetail(true)}} data-flow="up" data-bs-target="#exampleModal1" title="Quick View">
                                      <i className="fa-regular fa-eye" />
                                    </div>
                                  </div>
                                </div>
                                <div className="body-content">
                                  <div className="start-area-rating">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                  </div>
                                  <span className="availability">{item.IdHangSX?.TenHangSX}</span> <br/><br/>
                                  <a>
                                    <h4 className="title" onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)}>{item.TenSP}</h4>
                                  </a>
                                  {/* <span className="availability">500g Pack</span> */}
                                  <div className="price-area">
                                    <span className="current">
                                      {/* {(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ */}
                                      {Math.ceil(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ
                                    </span>
                                    {item.GiamGiaSP !== 0 ? 
                                    <>
                                    <div className="previous">{item.sizes[0].price.toLocaleString()}đ</div>
                                    </> : 
                                    <>
                                    <div className="previous"></div>
                                    </>}
                                    
                                  </div>
                                  <div className="cart-counter-action css-btn">
                                    <a onClick={() => handleAddToCart(item, item.sizes[0].price, item.sizes[0].size)} className="rts-btn btn-primary radious-sm with-icon">
                                      <div className="btn-text">
                                      Thêm vào giỏ hàng
                                      </div>
                                      <div className="arrow-icon">
                                        <i className="fa-regular fa-cart-shopping" />
                                      </div>
                                      <div className="arrow-icon">
                                        <i className="fa-regular fa-cart-shopping" />
                                      </div>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}

                      </div>
                    </div>                
              </div>
            </div>
          </div>
        </div>
      </div>      
      {/* popular -product wrapper 7 end */}

       {/* four feature areas start */}
       <div className="four-feature-in-one rts-section-gapBottom bg_gradient-tranding-items">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3">
              {/* single four feature */}
              <div className="feature-product-list-wrapper">
                <div className="title-area">
                  <h2 className="title titlee">
                  Mới thêm gần đây
                  </h2>
                </div>
                {dataSPNew.length !== 0 ? 
                <>
                <div
                  className="product-container"
                  style={{ transform: `translateY(-${offsetColumn1}px)` }} // Điều khiển cuộn
                >
                {dataSPNew?.map((item, index) => {
                  return (
                  <div className="single-product-list">
                    <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)} className="thumbnail">                      
                       <img style={{width: "80px"}} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="grocery" />
                    </a>
                    <div className="body-content">
                      <div className="top">
                        <div className="stars-area">
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                        </div>
                        <a href="#">
                          <h4 className="title" onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)}>{item.TenSP}</h4>
                        </a>
                        <div className="price-area">
                            <span className="current">
                              {/* {(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ */}
                              {Math.ceil(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ
                            </span>
                            {item.GiamGiaSP !== 0 ? 
                            <>
                            <div className="previous">{item.sizes[0].price.toLocaleString()}đ</div>
                            </> : 
                            <>
                            <div className="previous"></div>
                            </>}                          
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}
               </div>
                </> 
                : 
                <>
                <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                  <IoWarningOutline size={100} />
                  Chưa có sản phẩm nào cả! 
                </p>
                </>}
                
              </div>                    
              {/* single four feature end */}
            </div>
            <div className="col-lg-3">
              {/* single four feature */}
              <div className="feature-product-list-wrapper">
                <div className="title-area">
                  <h2 className="title titlee">
                  Đánh giá cao nhất
                  </h2>
                </div>
                {dataSPDanhGiaCaoNhat.length !== 0 ? 
                <>
                 <div
                  className="product-container"
                  style={{ transform: `translateY(-${offsetColumn2}px)` }} // Điều khiển cuộn
                >
                {dataSPDanhGiaCaoNhat?.map((item, index) => {
                  return (
                  <div className="single-product-list">
                    <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)} className="thumbnail">                      
                       <img style={{width: "80px"}} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="grocery" />
                    </a>
                    <div className="body-content">
                      <div className="top">
                        <div className="stars-area">
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                        </div>
                        <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)}>
                          <h4 className="title">{item.TenSP}</h4>
                        </a>
                        <div className="price-area">
                            <span className="current">
                              {/* {(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ */}
                              {Math.ceil(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ
                            </span>
                            {item.GiamGiaSP !== 0 ? 
                            <>
                            <div className="previous">{item.sizes[0].price.toLocaleString()}đ</div>
                            </> : 
                            <>
                            <div className="previous"></div>
                            </>}                          
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}
                </div>
                </> 
                : 
                <>
                <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                  <IoWarningOutline size={100} />
                  Chưa có sản phẩm nào cả! 
                </p>
                </>}               
              </div>                    
              {/* single four feature end */}
            </div>
            <div className="col-lg-3">
              {/* single four feature */}
              <div className="feature-product-list-wrapper">
                <div className="title-area">
                  <h2 className="title titlee">
                    Bán chạy nhất
                  </h2>
                </div>
                {dataSPSoLuotBanCao.length !== 0 ? 
                <>
                  <div
                  className="product-container"
                  style={{ transform: `translateY(-${offsetColumn3}px)` }} // Điều khiển cuộn
                >

                {dataSPSoLuotBanCao?.map((item, index) => {
                  return (
                  <div className="single-product-list">
                    <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)} className="thumbnail">                      
                       <img style={{width: "80px"}} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="grocery" />
                    </a>
                    <div className="body-content">
                      <div className="top">
                        <div className="stars-area">
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                          <i className="fa-solid fa-star" />
                        </div>
                        <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)}>
                          <h4 className="title">{item.TenSP}</h4>
                        </a>
                        <div className="price-area">
                            <span className="current">
                              {/* {(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ */}
                              {Math.ceil(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ
                            </span>
                            {item.GiamGiaSP !== 0 ? 
                            <>
                            <div className="previous">{item.sizes[0].price.toLocaleString()}đ</div>
                            </> : 
                            <>
                            <div className="previous"></div>
                            </>}                          
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}
                  </div>
                </> 
                : 
                <>
                <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                  <IoWarningOutline size={100} />
                  Chưa có sản phẩm nào cả! 
                </p>
                </>}                
              </div>                    
              {/* single four feature end */}
            </div>
            <div className="col-lg-3">
              {/* single four feature */}
              <div className="feature-product-list-wrapper">
                <div className="title-area">
                  <h2 className="title titlee">
                    Ưu đãi Cực Sốc
                  </h2>
                </div>
                
                {dataSPGiamGiaCao.length !== 0 ? 
                <>
                  <div
                    className="product-container"
                    style={{ transform: `translateY(-${offsetColumn4}px)` }} // Điều khiển cuộn
                  >

                  {dataSPGiamGiaCao?.map((item, index) => {
                    return (
                    <div className="single-product-list">
                      <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)} className="thumbnail">                      
                        <img style={{width: "80px"}} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="grocery" />
                      </a>
                      <div className="body-content">
                        <div className="top">
                          <div className="stars-area">
                            <i className="fa-solid fa-star" />
                            <i className="fa-solid fa-star" />
                            <i className="fa-solid fa-star" />
                            <i className="fa-solid fa-star" />
                            <i className="fa-solid fa-star" />
                          </div>
                          <a onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)}>
                            <h4 className="title">{item.TenSP}</h4>
                          </a>
                          <div className="price-area">
                              <span className="current">
                                {/* {(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ */}
                                {Math.ceil(item.sizes[0].price - (item.sizes[0].price * (item.GiamGiaSP / 100))).toLocaleString()}đ
                              </span>
                              {item.GiamGiaSP !== 0 ? 
                              <>
                              <div className="previous">{item.sizes[0].price.toLocaleString()}đ</div>
                              </> : 
                              <>
                              <div className="previous"></div>
                              </>}                          
                          </div>
                        </div>
                      </div>
                    </div>
                    )
                  })}
                  </div>
                </> 
                : 
                <>
                <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                  <IoWarningOutline size={100} />
                  Chưa có sản phẩm nào cả! 
                </p>
                </>}
                

              </div>                    
              {/* single four feature end */}
            </div>
          </div>
        </div>
      </div>
      {/* four feature areas end */}

       {/* rts feature product 2 area start */}
    <div className="rts-feature-large-product-area rts-section-gapBottom">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="feature-product-area-large-21 bg_image img-2">
                <div className="inner-feature-product-content">
                 
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-product-area-large-21 bg_2 bg_image img-3">
                <div className="inner-feature-product-content">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    {/* rts feature product 2 area end */}

    {isAuthenticated ? <>
      <div id="myModal-1" className="modal fade" role="dialog">
          <div className="modal-dialog bg_image">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-bs-dismiss="modal"><i className="fa-light fa-x" /></button>
              </div>
              <div className="modal-body text-center">
                <div className="inner-content">
                  <div className="content">
                    <span className="pre-title" style={{color: "whitesmoke"}}>Giảm giá tới 30% cho lần mua hàng đầu tiên trị giá 9.999.999đ của bạn</span>
                    <h1 className="title" style={{color: "whitesmoke"}}>Các sản phẩm hot nhất hiện nay  <br />
                      </h1>
                    <p className="disc" style={{color: "whitesmoke"}}>
                    Chúng tôi đã chuẩn bị các chương trình giảm giá đặc biệt cho bạn đối với các sản phẩm tạp hóa. 
                     <br /> Đừng bỏ lỡ những cơ hội này...
                    </p>
                    <div className="rts-btn-banner-area">
                      <a onClick={() => navigate("/all-product")} className="rts-btn btn-primary radious-sm with-icon" data-bs-dismiss="modal">
                        <div className="btn-text">
                          Mua ngay
                        </div>
                        <div className="arrow-icon">
                          <i className="fa-light fa-arrow-right" />
                        </div>
                        <div className="arrow-icon">
                          <i className="fa-light fa-arrow-right" />
                        </div>
                      </a>
                      {/* <div className="price-area">
                        <span>
                          from
                        </span>
                        <h3 className="title animated fadeIn">$80.99</h3>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </> : <>
      <div id="myModal-1" className="modal fade" role="dialog">
          <div className="modal-dialog modal-dialogg bg_image">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-bs-dismiss="modal"><i className="fa-light fa-x" /></button>
              </div>
              <div className="modal-body text-center">
                <div className="inner-content">
                  <div className="content">
                    <span className="pre-title" style={{color: "whitesmoke"}}>
                      {/* Nhận ngay Voucher Giảm giá lên tới 50% khi đăng ký và đăng nhập tài khoản */}
                      </span>
                    <h1 className="title" style={{color: "whitesmoke"}}>
                      {/* Hãy đăng ký tài khoản để nhận nhiều Voucher giảm giá hơn nha!!!<br /> */}
                      </h1>                    
                    <div className="rts-btn-banner-area" style={{justifyContent: "center", display: "flex", top: -80, position: "relative", cursor: "pointer"}}>
                      <a onClick={() => navigate("/register-web")} className="rts-btn btn-primary radious-sm with-icon" data-bs-dismiss="modal">
                        <div className="btn-text" >
                        Đi đăng ký để nhận ngay 1 lượt quay số trúng thưởng
                        </div>
                        <div className="arrow-icon">
                          <i className="fa-light fa-arrow-right" />
                        </div>
                        <div className="arrow-icon">
                          <i className="fa-light fa-arrow-right" />
                        </div>
                      </a>                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>}

        

       <ModalViewDetail
       openDetail={openDetail}
       setOpenDetail={setOpenDetail}
       setDataDetailSP={setDataDetailSP}
       setIdDetail={setIdDetail}
       dataDetailSP={dataDetailSP}
       />

        {/* <div className="modal modal-compare-area-start fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Products Compare</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="compare-main-wrapper-body">
                <div className="single-compare-elements name">Preview</div>
                <div className="single-compare-elements">
                  <div className="thumbnail-preview">
                    <img src="assets/images/grocery/01.jpg" alt="grocery" />
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="thumbnail-preview">
                    <img src="assets/images/grocery/02.jpg" alt="grocery" />
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="thumbnail-preview">
                    <img src="assets/images/grocery/03.jpg" alt="grocery" />
                  </div>
                </div>
              </div>
              <div className="compare-main-wrapper-body productname spacifiq">
                <div className="single-compare-elements name">Name</div>
                <div className="single-compare-elements">
                  <p>J.Crew Mercantile Women's Short</p>
                </div>
                <div className="single-compare-elements">
                  <p>Amazon Essentials Women's Tanks</p>
                </div>
                <div className="single-compare-elements">
                  <p>Amazon Brand - Daily Ritual Wom</p>
                </div>
              </div>
              <div className="compare-main-wrapper-body productname">
                <div className="single-compare-elements name">Price</div>
                <div className="single-compare-elements price">
                  <p>$25.00</p>
                </div>
                <div className="single-compare-elements price">
                  <p>$39.25</p>
                </div>
                <div className="single-compare-elements price">
                  <p>$12.00</p>
                </div>
              </div>
              <div className="compare-main-wrapper-body productname">
                <div className="single-compare-elements name">Description</div>
                <div className="single-compare-elements discription">
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                </div>
                <div className="single-compare-elements discription">
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                </div>
                <div className="single-compare-elements discription">
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
                </div>
              </div>
              <div className="compare-main-wrapper-body productname">
                <div className="single-compare-elements name">Rating</div>
                <div className="single-compare-elements">
                  <div className="rating">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <span>(25)</span>
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="rating">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <span>(19)</span>
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="rating">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <span>(120)</span>
                  </div>
                </div>
              </div>
              <div className="compare-main-wrapper-body productname">
                <div className="single-compare-elements name">Weight</div>
                <div className="single-compare-elements">
                  <div className="rating">
                    <p>320 gram</p>
                  </div>
                </div>
                <div className="single-compare-elements">
                  <p>370 gram</p>
                </div>
                <div className="single-compare-elements">
                  <p>380 gram</p>
                </div>
              </div>
              <div className="compare-main-wrapper-body productname">
                <div className="single-compare-elements name">Stock status</div>
                <div className="single-compare-elements">
                  <div className="instocks">
                    <span>In Stock</span>
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="outstocks">
                    <span className="out-stock">Out Of Stock</span>
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="instocks">
                    <span>In Stock</span>
                  </div>
                </div>
              </div>
              <div className="compare-main-wrapper-body productname">
                <div className="single-compare-elements name">Buy Now</div>
                <div className="single-compare-elements">
                  <div className="cart-counter-action">
                    <a href="#" className="rts-btn btn-primary radious-sm with-icon">
                      <div className="btn-text">
                        Add To Cart
                      </div>
                      <div className="arrow-icon">
                        <i className="fa-regular fa-cart-shopping" />
                      </div>
                      <div className="arrow-icon">
                        <i className="fa-regular fa-cart-shopping" />
                      </div>
                    </a>
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="cart-counter-action">
                    <a href="#" className="rts-btn btn-primary radious-sm with-icon">
                      <div className="btn-text">
                        Add To Cart
                      </div>
                      <div className="arrow-icon">
                        <i className="fa-regular fa-cart-shopping" />
                      </div>
                      <div className="arrow-icon">
                        <i className="fa-regular fa-cart-shopping" />
                      </div>
                    </a>
                  </div>
                </div>
                <div className="single-compare-elements">
                  <div className="cart-counter-action">
                    <a href="#" className="rts-btn btn-primary radious-sm with-icon">
                      <div className="btn-text">
                        Add To Cart
                      </div>
                      <div className="arrow-icon">
                        <i className="fa-regular fa-cart-shopping" />
                      </div>
                      <div className="arrow-icon">
                        <i className="fa-regular fa-cart-shopping" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div> */}

        <div>
        {/* successfully add in wishlist */}
        <div className="successfully-addedin-wishlist">
          <div className="d-flex" style={{alignItems: 'center', gap: '15px'}}>
            <i className="fa-regular fa-check" />
            <p>Your item has already added in wishlist successfully</p>
          </div>
        </div>
        {/* successfully add in wishlist end */}
        {/* progress area start */}
        <div className="progress-wrap">
          <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
            <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '307.919'}} />
          </svg>
        </div>
        {/* progress area end */}
      </div>
        </>
    )
}
export default Home
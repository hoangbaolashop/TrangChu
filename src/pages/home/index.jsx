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

      <div className="rts-shorts-service-area rts-section-gap bg_heading">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              {/* single service area start */}
              <div className="single-short-service-area-start">
                <div className="icon-area">
                  <svg width={80} height={80} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx={40} cy={40} r={40} fill="white" />
                    <path d="M55.7029 25.2971C51.642 21.2363 46.2429 19 40.5 19C34.7571 19 29.358 21.2363 25.2971 25.2971C21.2364 29.358 19 34.7571 19 40.5C19 46.2429 21.2364 51.642 25.2971 55.7029C29.358 59.7637 34.7571 62 40.5 62C46.2429 62 51.642 59.7637 55.7029 55.7029C59.7636 51.642 62 46.2429 62 40.5C62 34.7571 59.7636 29.358 55.7029 25.2971ZM40.5 59.4805C30.0341 59.4805 21.5195 50.9659 21.5195 40.5C21.5195 30.0341 30.0341 21.5195 40.5 21.5195C50.9659 21.5195 59.4805 30.0341 59.4805 40.5C59.4805 50.9659 50.9659 59.4805 40.5 59.4805Z" fill="#629D23" />
                    <path d="M41.8494 39.2402H39.1506C37.6131 39.2402 36.3623 37.9895 36.3623 36.452C36.3623 34.9145 37.6132 33.6638 39.1506 33.6638H44.548C45.2438 33.6638 45.8078 33.0997 45.8078 32.404C45.8078 31.7083 45.2438 31.1442 44.548 31.1442H41.7598V28.3559C41.7598 27.6602 41.1957 27.0962 40.5 27.0962C39.8043 27.0962 39.2402 27.6602 39.2402 28.3559V31.1442H39.1507C36.2239 31.1442 33.8429 33.5253 33.8429 36.452C33.8429 39.3787 36.224 41.7598 39.1507 41.7598H41.8495C43.3869 41.7598 44.6377 43.0106 44.6377 44.548C44.6377 46.0855 43.3869 47.3363 41.8495 47.3363H36.452C35.7563 47.3363 35.1923 47.9004 35.1923 48.5961C35.1923 49.2918 35.7563 49.8559 36.452 49.8559H39.2402V52.6442C39.2402 53.34 39.8043 53.904 40.5 53.904C41.1957 53.904 41.7598 53.34 41.7598 52.6442V49.8559H41.8494C44.7761 49.8559 47.1571 47.4747 47.1571 44.548C47.1571 41.6214 44.7761 39.2402 41.8494 39.2402Z" fill="#629D23" />
                  </svg>
                </div>
                <div className="information">
                  <h4 className="title">Giá tốt nhất &amp; Ưu đãi</h4>
                  <p className="disc">
                  Chúng tôi đã chuẩn bị các mức giảm giá đặc biệt cho các sản phẩm trong cửa hàng.
                  </p>
                </div>
              </div>
              {/* single service area end */}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              {/* single service area start */}
              <div className="single-short-service-area-start">
                <div className="icon-area">
                  <svg width={80} height={80} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx={40} cy={40} r={40} fill="white" />
                    <path d="M55.5564 24.4436C51.4012 20.2884 45.8763 18 40 18C34.1237 18 28.5988 20.2884 24.4436 24.4436C20.2884 28.5988 18 34.1237 18 40C18 45.8763 20.2884 51.4012 24.4436 55.5564C28.5988 59.7116 34.1237 62 40 62C45.8763 62 51.4012 59.7116 55.5564 55.5564C59.7116 51.4012 62 45.8763 62 40C62 34.1237 59.7116 28.5988 55.5564 24.4436ZM40 59.4219C29.2907 59.4219 20.5781 50.7093 20.5781 40C20.5781 29.2907 29.2907 20.5781 40 20.5781C50.7093 20.5781 59.4219 29.2907 59.4219 40C59.4219 50.7093 50.7093 59.4219 40 59.4219Z" fill="#629D23" />
                    <path d="M42.4009 34.7622H35.0294L36.295 33.4966C36.7982 32.9934 36.7982 32.177 36.295 31.6738C35.7914 31.1703 34.9753 31.1703 34.4718 31.6738L31.0058 35.1398C30.5022 35.6434 30.5022 36.4594 31.0058 36.9626L34.4718 40.429C34.7236 40.6808 35.0536 40.8067 35.3832 40.8067C35.7132 40.8067 36.0432 40.6808 36.295 40.429C36.7982 39.9255 36.7982 39.1094 36.295 38.6059L35.0291 37.3403H42.4009C44.8229 37.3403 46.7934 39.3108 46.7934 41.7328C46.7934 44.1549 44.8229 46.1254 42.4009 46.1254H37.8925C37.1805 46.1254 36.6035 46.7028 36.6035 47.4145C36.6035 48.1265 37.1805 48.7035 37.8925 48.7035H42.4009C46.2446 48.7035 49.3716 45.5765 49.3716 41.7328C49.3716 37.8892 46.2446 34.7622 42.4009 34.7622Z" fill="#629D23" />
                  </svg>
                </div>
                <div className="information">
                  <h4 className="title">Chính sách hoàn trả 100%</h4>
                  <p className="disc">
                    Chúng tôi đã chuẩn bị các mức giảm giá đặc biệt cho các sản phẩm trong cửa hàng.
                  </p>
                </div>
              </div>
              {/* single service area end */}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              {/* single service area start */}
              <div className="single-short-service-area-start">
                <div className="icon-area">
                  <svg width={80} height={80} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx={40} cy={40} r={40} fill="white" />
                    <path d="M26.2667 26.2667C29.935 22.5983 34.8122 20.5781 40 20.5781C43.9672 20.5781 47.8028 21.7849 51.0284 24.0128L48.5382 24.2682L48.8013 26.8328L55.5044 26.1453L54.8169 19.4422L52.2522 19.7053L52.4751 21.8787C48.8247 19.3627 44.4866 18 40 18C34.1236 18 28.5989 20.2884 24.4437 24.4437C20.2884 28.5989 18 34.1236 18 40C18 44.3993 19.2946 48.6457 21.7437 52.28L23.8816 50.8393C23.852 50.7952 23.8232 50.7508 23.7939 50.7065C21.69 47.5289 20.5781 43.8307 20.5781 40C20.5781 34.8123 22.5983 29.935 26.2667 26.2667Z" fill="#629D23" />
                    <path d="M58.2564 27.72L56.1184 29.1607C56.148 29.2047 56.1768 29.2493 56.2061 29.2935C58.3099 32.4711 59.4219 36.1693 59.4219 40C59.4219 45.1878 57.4017 50.065 53.7333 53.7333C50.0651 57.4017 45.1879 59.4219 40 59.4219C36.0328 59.4219 32.1972 58.2151 28.9716 55.9872L31.4618 55.7318L31.1987 53.1672L24.4956 53.8547L25.1831 60.5578L27.7478 60.2947L27.5249 58.1213C31.1754 60.6373 35.5135 62 40 62C45.8764 62 51.4011 59.7116 55.5564 55.5563C59.7117 51.4011 62 45.8764 62 40C62 35.6007 60.7055 31.3543 58.2564 27.72Z" fill="#629D23" />
                    <path d="M28.7407 42.7057L30.4096 41.1632C31.6739 40 31.9142 39.2161 31.9142 38.3564C31.9142 36.7127 30.5108 35.6633 28.4753 35.6633C26.7305 35.6633 25.4788 36.3966 24.8087 37.5093L26.6673 38.546C27.0213 37.9771 27.6029 37.6863 28.2477 37.6863C29.0063 37.6863 29.3856 38.0276 29.3856 38.5966C29.3856 38.9633 29.2845 39.3679 28.5764 40.0254L25.2639 43.123V44.6907H32.1544V42.7057L28.7407 42.7057Z" fill="#629D23" />
                    <path d="M40.1076 42.9965H41.4224V41.0115H40.1076V39.507H37.7433V41.0115H35.948L39.5512 35.8404H36.9594L32.9894 41.3655V42.9965H37.6674V44.6906H40.1076V42.9965Z" fill="#629D23" />
                    <path d="M43.6986 45.955L47.8708 34.045H45.7341L41.5618 45.955H43.6986Z" fill="#629D23" />
                    <path d="M49.995 39.1908V37.8254H52.3213L49.3375 44.6906H52.0685L55.1913 37.4081V35.8404H47.8582V39.1908H49.995Z" fill="#629D23" />
                  </svg>
                </div>
                <div className="information">
                  <h4 className="title">Hỗ trợ 24/7</h4>
                  <p className="disc">
                    Chúng tôi đã chuẩn bị các mức giảm giá đặc biệt cho các sản phẩm trong cửa hàng.
                  </p>
                </div>
              </div>
              {/* single service area end */}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              {/* single service area start */}
              <div className="single-short-service-area-start">
                <div className="icon-area">
                  <svg width={80} height={80} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx={40} cy={40} r={40} fill="white" />
                    <path d="M57.0347 37.5029C54.0518 29.3353 48.6248 23.7668 48.3952 23.5339L46.2276 21.3333V29.6016C46.2276 30.3124 45.658 30.8906 44.9578 30.8906C44.2577 30.8906 43.688 30.3124 43.688 29.6016C43.688 23.2045 38.5614 18 32.26 18H30.9902V19.2891C30.9902 25.3093 27.0988 29.646 24.1414 35.2212C21.1581 40.8449 21.3008 47.7349 24.5138 53.2021C27.7234 58.6637 33.5291 62 39.7786 62H40.3686C46.1822 62 51.6369 59.1045 54.9597 54.2545C58.2819 49.4054 59.056 43.0371 57.0347 37.5029ZM52.8748 52.7824C50.0265 56.9398 45.3513 59.4219 40.3686 59.4219H39.7786C34.4416 59.4219 29.4281 56.5325 26.6947 51.8813C23.9369 47.1886 23.8153 41.2733 26.3773 36.4436C29.1752 31.1691 32.9752 26.8193 33.4744 20.662C37.803 21.265 41.1483 25.0441 41.1483 29.6015C41.1483 31.7338 42.8572 33.4687 44.9577 33.4687C47.0581 33.4687 48.767 31.7338 48.767 29.6015V27.9161C50.54 30.2131 53.0138 33.9094 54.6534 38.399C56.3856 43.1416 55.704 48.653 52.8748 52.7824Z" fill="#629D23" />
                    <path d="M38.6089 40C38.6089 37.8676 36.9 36.1328 34.7996 36.1328C32.6991 36.1328 30.9902 37.8676 30.9902 40C30.9902 42.1324 32.6991 43.8672 34.7996 43.8672C36.9 43.8672 38.6089 42.1324 38.6089 40ZM33.5298 40C33.5298 39.2892 34.0994 38.7109 34.7996 38.7109C35.4997 38.7109 36.0693 39.2892 36.0693 40C36.0693 40.7108 35.4997 41.2891 34.7996 41.2891C34.0994 41.2891 33.5298 40.7108 33.5298 40Z" fill="#629D23" />
                    <path d="M44.9578 46.4453C42.8573 46.4453 41.1485 48.1801 41.1485 50.3125C41.1485 52.4449 42.8573 54.1797 44.9578 54.1797C47.0583 54.1797 48.7672 52.4449 48.7672 50.3125C48.7672 48.1801 47.0583 46.4453 44.9578 46.4453ZM44.9578 51.6016C44.2577 51.6016 43.688 51.0233 43.688 50.3125C43.688 49.6017 44.2577 49.0234 44.9578 49.0234C45.658 49.0234 46.2276 49.6017 46.2276 50.3125C46.2276 51.0233 45.658 51.6016 44.9578 51.6016Z" fill="#629D23" />
                    <path d="M32.5466 52.0632L45.2407 36.599L47.1911 38.249L34.4969 53.7132L32.5466 52.0632Z" fill="#629D23" />
                  </svg>                                
                </div>
                <div className="information">
                  <h4 className="title">Khuyến mãi lớn Khuyến mãi hàng ngày</h4>
                  <p className="disc">
                    Chúng tôi đã chuẩn bị các mức giảm giá đặc biệt cho các sản phẩm trong cửa hàng.
                  </p>
                </div>
              </div>
              {/* single service area end */}
            </div>
          </div>
        </div>
      </div>

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

    {/* rts feature product 2 area start */}
    <div className="rts-feature-large-product-area rts-section-gapBottom">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="feature-product-area-large-2 bg_image">
                {/* <img src="https://cdn.hoanghamobile.com/Uploads/2024/12/17/vong-xoay-can-giua.gif;trim.threshold=0;trim.percentpadding=0;width=480;" alt="" /> */}
                <div className="inner-feature-product-content">
                  {/* <span>Weekend Discount</span>
                  <h2 className="title">
                    Feed The Best Energy <br />
                    Drink Booster
                  </h2>
                  <p>Just don’t miss the special offer this week</p>
                  <a href="shop-grid-top-filter.html" className="rts-btn btn-primary">Shop Now</a> */}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-product-area-large-2 bg_2 bg_image">
                <div className="inner-feature-product-content">
                  {/* <span>Weekend Discount</span>
                  <h2 className="title">
                    Our Garden Fresh <br />
                    Vegetables
                  </h2>
                  <p>Just don’t miss the special offer this week</p>
                  <a href="shop-grid-top-filter.html" className="rts-btn btn-primary">Shop Now</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    {/* rts feature product 2 area end */}

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
                        Đi đăng ký để nhận ngay 3 lượt quay số trúng thưởng
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
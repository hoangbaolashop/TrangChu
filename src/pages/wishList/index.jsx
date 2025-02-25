import { Tooltip } from "antd";
import { IoWarningOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { doDeleteItemWishlistAction } from "../../redux/wishlist/wishlistSlice";
import { checkProductAvailability, doAddAction } from "../../redux/order/orderSlice";
import { useState } from "react";

const WishList = () => {

    const wishList = useSelector((state) => state.wishlist.Wishlist);
    const customerId = useSelector(state => state.accountKH.user._id)
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [discountCode, setDiscountCode] = useState("MAVOUCHER");  // Mã giảm giá
    const dispatch = useDispatch();

    const handleRedirectLayIdDeXemDetailPageUrl = (item) => {
        console.log("id: ", item);
        // Lấy các _id từ mảng idLoaiSP và chuyển thành chuỗi
        const idLoaiSPString = item.IdLoaiSP.map(loai => loai._id).join(',');
        window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`
        // navigate(`/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`)
    }

    const deleteWishlistAProduct = (productId, size) => {
        console.log("productId, size: ", productId, size);
        
        dispatch(doDeleteItemWishlistAction({productId, size, customerId}))
    }

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
            
        dispatch(doAddAction({ dataDetailSP: product, currentQuantity, discountCode, customerId, selectedItemss: giaChon, selectedSize: sizeChon }));
    };

    return (
        <>
            <div className="rts-navigation-area-breadcrumb bg_light-1">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                        <a>Home</a>
                        <i className="fa-regular fa-chevron-right" />
                        <a className="current">Danh sách yêu thích</a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="section-seperator bg_light-1">
                <div className="container">
                <hr className="section-seperator" />
                </div>
            </div>

            <div className="rts-cart-area rts-section-gap bg_light-1">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-12">
                            <div className="rts-cart-list-area wishlist">
                                <div className="single-cart-area-list head">
                                    <div className="product-main">
                                    <p>Sản phẩm</p>
                                    </div>
                                    <div className="quantity">
                                    <p>Giá cũ</p>
                                    </div>
                                    <div className="subtotal">
                                    <p>Giá bán</p>
                                    </div>
                                    <div className="price">
                                    <p></p>
                                    </div>
                                    <div className="button-area">
                                    </div>
                                </div>
                                
                                {wishList.length > 0 ? (
                                <>
                                {wishList.map((item, index) => {
                                    return (
                                    <div className="single-cart-area-list main  item-parent">
                                        <div className="product-main-cart">
                                            <div className="close section-activation">
                                                {/* <img src="assets/images/shop/01.png" alt="shop" /> */}
                                                <Tooltip title="xóa sản phẩm này" color={'green'} key={'green'}>
                                                    <RiDeleteBin6Line onClick={() => deleteWishlistAProduct(item._id, item.sizeDaChon)} style={{color: "red"}} size={25} />                                           
                                                </Tooltip>
                                            </div>
                                            <div className="thumbnail">
                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.detail.Image}`} alt="shop" />
                                            </div>
                                            <div className="information">
                                                <h6 style={{cursor: "pointer"}} onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item.detail)} className="title">{item.detail.TenSP}</h6>
                                                <span style={{marginTop: "10px"}}>Cấu hình: {item.sizeDaChon}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="quantity" style={{textAlign: "center"}}>                                           
                                            <s style={{color: "gray"}}>{Math.ceil(item.priceDaChon).toLocaleString()}đ</s>
                                        </div>
                                        <div className="subtotal" style={{textAlign: "center"}}>
                                            <p style={{color: "red"}}>{Math.ceil(item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100))).toLocaleString()}đ</p>
                                        </div>

                                        <div className="price"></div>
                                        
                                        <div className="button-area">
                                        <a style={{cursor: "pointer"}} onClick={() => handleAddToCart(item.detail, item.detail.sizes[0].price, item.detail.sizes[0].size)}  className="rts-btn btn-primary radious-sm with-icon">
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
                                )})}

                                </>
                                ) : (
                                    <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                                    <IoWarningOutline size={100} />
                                    Chưa có sản phẩm nào trong danh sách yêu thích! 
                                    </p> 
                                )}
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </>
    )
}
export default WishList
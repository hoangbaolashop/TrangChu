import { Col, Divider, InputNumber, Modal, Rate, Row, Select, Skeleton, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import { useDispatch, useSelector } from "react-redux";
import './css.scss'
import { checkProductAvailability, doAddAction } from "../../redux/order/orderSlice";
import { doAddActionWishlist } from "../../redux/wishlist/wishlistSlice";
const ModalViewDetail = (props) => {

    const {
        openDetail, setOpenDetail, setDataDetailSP, setIdDetail, dataDetailSP
    } = props
    const refGallery = useRef(null);
    const [selectedItems, setSelectedItems] = useState('0');

    const [currentQuantity, setCurrentQuantity] = useState(1);
    const dispatch = useDispatch();

    const customerId = useSelector(state => state.accountKH.user._id)
    const [discountCode, setDiscountCode] = useState("MAVOUCHER");  // Mã giảm giá
    const [selectedSize, setSelectedSize] = useState('');  // Kích thước đã chọn

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (dataDetailSP) {
            setLoading(false);
        }
    }, [dataDetailSP]);

    const handleAddToCart = async  () => {
    
        // Truyền thông tin sản phẩm vào checkProductAvailability
        const availability = await dispatch(
            checkProductAvailability({ dataDetailSP, selectedSize, currentQuantity })
        );
        console.log("availability: ", availability);

        if (!availability.payload) {
            // Nếu không đủ số lượng, hiển thị thông báo lỗi            
            return;
        }

        console.log("Số lượng đủ, tiếp tục thêm vào giỏ hàng");

        dispatch(doAddAction({ dataDetailSP, currentQuantity, discountCode, customerId, selectedItemss, selectedSize }));
    };
    const handleAddToCart1 = () => {
        dispatch(doAddAction({ dataDetailSP, currentQuantity, discountCode, customerId, selectedItemss: selectedItems, selectedSize }));
    };
    console.log("gia chon: ", selectedItems);
    console.log("selectedSize: ", selectedSize);

    const handleAddWishList = () => {            
        dispatch(doAddActionWishlist({ dataDetailSP, customerId, selectedItemss: selectedItems, selectedSize }));
    };
    

    const onChangeSizes = (e) => {        
        console.log("value: ", e);
        
        
        const selectedSizeObj = dataDetailSP.sizes.find(item => item._id === e);  // Tìm đối tượng kích thước dựa trên _id
        if (selectedSizeObj) {
            setSelectedItems(selectedSizeObj.price)
            setSelectedSize(selectedSizeObj.size); // Lưu kích thước (ví dụ: '128gb' hoặc '256gb')
        }
    }
    const onChangeQuantity = (value) => {
        console.log('changed soluong', value);
        setCurrentQuantity(value)
    };

    const cancel = () => {
        setOpenDetail(false)
        setDataDetailSP(null)
        setSelectedItems('')
        setCurrentQuantity(1)
    }
    

    const imageBaseUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/`;

    // Biến đổi mảng tên file thành các URL ảnh
    const images = dataDetailSP?.ImageSlider?.map(imageName => ({
        original: `${imageBaseUrl}${imageName}`,
        thumbnail: `${imageBaseUrl}${imageName}`,  // Nếu bạn có ảnh thumbnail riêng, thay đổi cho phù hợp
    })) ?? [];


    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        // setIsOpenModalGallery(true);
        // setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        refGallery?.current?.fullScreen()
    }

    useEffect(() => {
        if (dataDetailSP?.sizes.length > 0) {
            // Gán giá trị của size đầu tiên vào selectedItems khi component được mount
            setSelectedItems(dataDetailSP.sizes[0].price);
        }

        if (dataDetailSP?.sizes.length > 0) {
            // Gán giá trị của size đầu tiên vào selectedItems khi component được mount
            setSelectedSize(dataDetailSP.sizes[0].size);
        }
    }, [dataDetailSP, openDetail]);

    const soLuongTonKho = dataDetailSP?.sizes.reduce((total, size) => total + size.quantity, 0)

    return (

        <>
            <Modal
                // title="Xem chi tiết"
                centered
                open={openDetail}
                onCancel={cancel}
                footer={null}  
                width={1200}
                style={{marginTop: "50px", marginBottom: "50px"}}
            >      
                <Row gutter={[25, 20]}>
                {loading ? (
                    <Col span={10}>
                        <Skeleton.Image active />
                    </Col>
                ) : (
                    <Col md={10} sm={0} xs={0}>
                        <ImageGallery                       
                            ref={refGallery}
                            items={images}
                            showPlayButton={true} //hide play button
                            // showFullscreenButton={false} //hide fullscreen button
                            renderLeftNav={() => <></>} //left arrow === <> </>
                            renderRightNav={() => <></>}//right arrow === <> </>
                            slideOnThumbnailOver={true}  //onHover => auto scroll images
                            onClick={() => handleOnClickImage()}
                        />
                    </Col>
                )}

                    {loading ? (
                        <Col span={14}>  
                            <Skeleton paragraph={{ rows: 5 }} active />     
                        </Col>                                          
                    ) : ( 

                        <Col span={14} md={14} sm={24} xs={0}>
                        {loading ? (
                            <Col span={10}>
                                <Skeleton.Image active />
                            </Col>
                        ) : (
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={true} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    showThumbnails={false}
                                />
                            </Col>
                        )}

                        {loading ? (
                            <Col span={14}>  
                                <div className="contents">
                                    <Skeleton paragraph={{ rows: 5 }} active />     
                                </div>    
                            </Col>                                          
                        ) : ( 
                            <Col span={24}>
                                <div style={{marginTop: "-70px"}} className="rts-product-details-section rts-product-details-section2 product-details-popup-section">
                                    <div className="details-product-area">
                                        <div className="contents">
                                            <div className="product-status">
                                            {dataDetailSP?.sizes.reduce((total, size) => total + size.quantity, 0) !== 0 ? 
                                            <>
                                            <span className="product-catagory" style={{padding: "5px"}}> Còn hàng</span>
                                            </> 
                                            : 
                                            <>
                                            <span className="product-catagory" style={{padding: "5px", backgroundColor: "red"}}> Hết hàng</span>
                                            </>}
                                            {/* <span className="product-catagory">Dress</span> */}
                                            <div className="rating-stars-group">
                                                <div className="rating-star"><i className="fas fa-star" /></div>
                                                <div className="rating-star"><i className="fas fa-star" /></div>
                                                <div className="rating-star"><i className="fas fa-star" /></div>
                                                <div className="rating-star"><i className="fas fa-star" /></div>
                                                <div className="rating-star"><i className="fas fa-star" /></div>
                                                {/* <div className="rating-star"><i className="fas fa-star-half-alt" /></div> */}
                                                <span>999 Reviews</span>
                                            </div>
                                            </div>
                                            <h2 className="product-title">
                                                {dataDetailSP?.TenSP} 
                                                {dataDetailSP?.SoLuongTon !== 0 ? 
                                                <> <br/>
                                                <span className="stock">Có sẵn</span>
                                                </> : 
                                                <> 
                                                <br/>
                                                <span className="stock" style={{backgroundColor: "red", color: "white", padding: "5px", borderRadius: "8px", border: "none"}}>Hết hàng</span>
                                                </>}                                
                                            </h2>
                                            
                                            {dataDetailSP?.GiamGiaSP !== 0 ? 
                                            <>
                                            <span className="product-price">
                                                <span className="old-price">
                                                    {/* {dataDetailSP?.sizes[0].price.toLocaleString()}đ */}
                                                    {selectedItems.toLocaleString()}đ
                                                </span>  &nbsp;
                                                {/* {Math.ceil(dataDetailSP?.sizes[0].price - (dataDetailSP?.sizes[0].price * (dataDetailSP?.GiamGiaSP / 100))).toLocaleString()}đ */}
                                                {Math.ceil(selectedItems - (selectedItems * (dataDetailSP?.GiamGiaSP / 100))).toLocaleString()}đ
                                            </span>                            
                                            </> :                             
                                            <>
                                                <span className="product-price">
                                                    {selectedItems.toLocaleString()}đ
                                                </span> 
                                            </>}
                                            <p>
                                                <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataDetailSP?.MoTa }} />
                                            </p>
                                            <div class="variable-product-type mb--15">
                                                <div class="single-select">
                                                    <InputNumber disabled={soLuongTonKho === 0 ? true : false} style={{width: "100px"}} min={1} max={1000} value={currentQuantity} defaultValue={1} onChange={onChangeQuantity} />

                                                    <Select
                                                        disabled={soLuongTonKho === 0 ? true : false}
                                                        placeholder="CHỌN SIZE"
                                                        value={selectedSize}
                                                        onChange={onChangeSizes}
                                                        style={{
                                                            width: '200px',
                                                            height: "50px"
                                                        }}
                                                        options={dataDetailSP?.sizes.map((item) => ({
                                                            value: item._id,
                                                            label: item.size,
                                                        }))}
                                                    />
                                                </div>                                                
                                                <span>
                                                    {soLuongTonKho === 0 ? <>    
                                                        <Tooltip title="Không thể thêm vào giỏ hàng" color={'green'} key={'green'}>
                                                        <a disabled={soLuongTonKho === 0 ? true : false} style={{ backgroundColor: "black", color: "white"}} className="rts-btn btn-primary radious-sm with-icon">
                                                            <div className="btn-text">
                                                            Hết hàng
                                                            </div>
                                                            <div className="arrow-icon">
                                                            <i className="fa-regular fa-cart-shopping" />
                                                            </div>
                                                            <div className="arrow-icon">
                                                            <i className="fa-regular fa-cart-shopping" />
                                                            </div>
                                                        </a>                                                        
                                                        </Tooltip>                                                
                                                    </> : <>
                                                    <a onClick={() => handleAddToCart()} className="rts-btn btn-primary radious-sm with-icon">
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
                                                    </>}
                                                    {/* <a onClick={() => handleAddToCart()} className="rts-btn btn-primary radious-sm with-icon">
                                                        <div className="btn-text">
                                                        Add To Cart
                                                        </div>
                                                        <div className="arrow-icon">
                                                        <i className="fa-regular fa-cart-shopping" />
                                                        </div>
                                                        <div className="arrow-icon">
                                                        <i className="fa-regular fa-cart-shopping" />
                                                        </div>
                                                    </a> */}
                                                </span>                                           
                                            </div>                                                                              
                                            <div className="product-uniques">                                
                                                <span className="sku product-unipue" ><span style={{fontWeight: "400"}}>Thương hiệu: </span> {dataDetailSP?.IdHangSX.TenHangSX}</span>
                                                <span className="catagorys product-unipue">
                                                    <span style={{fontWeight: "400"}}>Loại sản phẩm:
                                                    {dataDetailSP?.IdLoaiSP?.map((item, index) => {
                                                        return (
                                                            <span key={index} style={{fontWeight: "400"}}> &nbsp;
                                                            {item.TenLoaiSP}{index < dataDetailSP.IdLoaiSP.length - 1 ? ', ' : ''}
                                                            </span>
                                                        )
                                                    } )}
                                                    </span>
                                                </span>
                                                <span className="tags product-unipue">
                                                    <span style={{fontWeight: "bold", marginRight: '10px', fontWeight: "400"}}>Giảm giá: </span> 
                                                    <span style={{color: "red"}}>{dataDetailSP?.GiamGiaSP}%</span>
                                                </span>
                                                <span className="tags product-unipue">
                                                    <span style={{fontWeight: "bold", marginRight: '10px', fontWeight: "400"}}>Số lượng đã bán: </span> 
                                                    <span style={{color: "red"}}>{dataDetailSP?.SoLuongBan} </span> sản phẩm
                                                </span>
                                            </div>
                                            <div className="share-social">
                                            <span>Chia sẻ:</span> &nbsp;
                                            <a className="platform" href="http://facebook.com/" target="_blank"><i className="fab fa-facebook-f" /></a>
                                            <a className="platform" href="http://twitter.com/" target="_blank"><i className="fab fa-twitter" /></a>
                                            <a className="platform" href="http://behance.com/" target="_blank"><i className="fab fa-behance" /></a>
                                            <a className="platform" href="http://youtube.com/" target="_blank"><i className="fab fa-youtube" /></a>
                                            <a className="platform" href="http://linkedin.com/" target="_blank"><i className="fab fa-linkedin" /></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        )}
                        </Col>
                    )}
                </Row>   
            </Modal>
        </>
    )
}
export default ModalViewDetail
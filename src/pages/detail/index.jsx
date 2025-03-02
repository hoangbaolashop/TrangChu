import './css.scss'
import svg01 from '/src/assets/images/shop/01.svg'
import svg02 from '/src/assets/images/shop/02.svg'
import svg03 from '/src/assets/images/shop/03.svg'
import png03 from '/src/assets/images/shop/03.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { fetchAllProductToCategoryLienQuan, fetchSPDetail } from '../../services/productAPI'
import { Avatar, Button, Col, Divider, Form, Input, InputNumber, message, Modal, notification, Pagination, Rate, Row, Select, Skeleton, Spin, Tooltip } from 'antd'
import ImageGallery from "react-image-gallery";
import { useDispatch, useSelector } from 'react-redux'
import { IoWarningOutline } from 'react-icons/io5'
import ModalViewDetail from '../../components/Modal/ModalViewDetail'
import { checkProductAvailability, doAddAction } from '../../redux/order/orderSlice'
import { doAddActionWishlist } from '../../redux/wishlist/wishlistSlice'
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { createComment, deleteComment, fetchAllComment } from '../../services/commentAPI'
import { RiDeleteBin6Line } from 'react-icons/ri'
import LuckyWheel from './LuckyWheel'
import { CSSTransition } from 'react-transition-group'

const DetailProduct = () => {
    const refGallery = useRef(null);
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [idDetail, setIdDetail] = useState(null)
    const [dataDetailSP, setDataDetailSP] = useState(null)
    const [dataDetailSPModal, setDataDetailSPModal] = useState(null)
    const [selectedItemss, setSelectedItemss] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [dataProductToCategory, setDataProductToCategory] = useState([])
    const [openDetail, setOpenDetail] = useState(false)
    const isAuthenticated = useSelector((state) => state.accountKH.isAuthenticated);

    const customerId = useSelector(state => state.accountKH.user._id)
    const [discountCode, setDiscountCode] = useState("MAVOUCHER");  // Mã giảm giá
    const [selectedSize, setSelectedSize] = useState('');  // Kích thước đã chọn

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [total, setTotal] = useState(0)

    const [currentCmt, setCurrentCmt] = useState(1)
    const [pageSizeCmt, setPageSizeCmt] = useState(5)
    const [totalCmt, setTotalCmt] = useState(0)

    const [formComment] = Form.useForm()
    const [dataComment, setDataComment] = useState([])
    const [starCount, setStarCount] = useState([]);
    console.log("datacomment: ", dataComment);
    console.log("starCount: ", starCount);

    const [loading, setLoading] = useState(true);
    const [showProductImage, setShowProductImage] = useState(false); // Hiển thị sản phẩm khi thêm vào giỏ
    const cartRef = useRef(null); // Tham chiếu đến giỏ hàng

    const tooltips = ['Chưa hài lòng', 'Không tốt', 'Bình thường', 'Tốt', 'Rất tốt'];    

    useEffect(() => {
        if (dataDetailSP) {
        setLoading(false);
        }
    }, [dataDetailSP]);
    

    const handleComment = async (values) => {
        console.log('Giá trị đánh giá sao: ', values.rating); // Lấy giá trị rating khi submit
        console.log('Giá trị bình luận: ', values.note); // Lấy giá trị bình luận
        console.log('data comment: ', values.note, values.rating, customerId, dataDetailSP?._id); // Lấy giá trị bình luận

        const res = await createComment(values.note, values.rating, customerId, dataDetailSP?._id)
        if (res && res.data) {
            message.success(res.message);
            // setDataComment(res.data)
            // Thêm bình luận mới vào danh sách bình luận hiện tại
            const newComment = {
                title: values.note,
                soSaoDanhGia: values.rating,
                idKH: customerId,
                idSP: dataDetailSP?._id,
                createdAt: new Date(), // Có thể bạn sẽ cần xử lý lại ngày tháng tùy theo yêu cầu
            };

            setDataComment((prevData) => [newComment, ...prevData]); // Thêm bình luận mới vào đầu danh sách bình luận
            formComment.resetFields()
            await handleFindComments()
        } else {
            notification.error({
                message: 'comment không thành công!',
                description: res.message
            })
        }
    }

    const handleFindComments = async () => {
        let query = `page=${currentCmt}&limit=${pageSizeCmt}&idSP=${dataDetailSP?._id}`
        const res = await fetchAllComment(query)
        console.log("res datacomment: ", res);
        if (res && res.data) {
            // message.success(res.message)
            setDataComment(res.data.comments)
            setStarCount(res.data.starCount); 
            setTotalCmt(res.data.totalComments)
        } 
    }

    const handleDeleteComment = async (id) => {

        let xoaComment = await deleteComment(id)
        if (xoaComment && xoaComment.data) {
            message.success(xoaComment.message)
            await handleFindComments()
        } else {
            notification.error({
                message: 'delete comment không thành công!',
                description: xoaComment.message
            })
        }
    }
    

    useEffect(() => {
        handleFindComments()
    },[dataDetailSP?._id, customerId, currentCmt, pageSizeCmt])

    let tenSearch = queryParams.get('TenSP')
    console.log("tensp lien quan: ", tenSearch);


    console.log("currentQuantity them gio hang: ", currentQuantity);
    console.log("selectedSize da chon: ", selectedSize);
    
    const dispatch = useDispatch();
    // Lấy giá trị của tham số 'id'
    const id = queryParams.get('id');
    const idLoaiSP = queryParams.get('idLoaiSP');
    console.log("id: ", id);
    console.log("idLoaiSP: ", idLoaiSP);
    
    const fetchProductDetail= async () => {  
        if (!dataDetailSP) { // Chỉ fetch khi dataDetailSP chưa có dữ liệu
            const res = await fetchSPDetail(id);
            console.log("res TL: ", res);
            if (res && res.data) {
                setDataDetailSP(res.data);
            }
        }
    }    

    const handleFindProductToCategory = async () => {
        let query = `page=${current}&limit=${pageSize}`
        // Kiểm tra nếu idLoaiSP là mảng hoặc một giá trị đơn
        const idLoaiSPArray = Array.isArray(idLoaiSP) ? idLoaiSP : [idLoaiSP];  // Nếu không phải mảng, chuyển thành mảng
  
        if (idLoaiSPArray.length > 0) {
          query += `&IdLoaiSP=${idLoaiSPArray.join(',')}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
        }

        if (tenSearch) {
            query += `&TenSP=${encodeURIComponent(tenSearch)}`;
        }  

        const res = await fetchAllProductToCategoryLienQuan(query)
        console.log("res sp: ", res);      
        if (res && res.data && res.data.length > 0) {
          // Nếu có sản phẩm thì cập nhật lại state
          setDataProductToCategory(res.data);
          setTotal(res.totalSanPham)
        } else {
          // Nếu không có sản phẩm, sẽ không cần làm gì nữa
          setDataProductToCategory([]);
        }
    }
    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }

        // Cuộn về đầu trang
        window.scrollTo({ top: 1999, behavior: 'smooth' });
    }
    const handleOnchangePageCMT = (pagination) => {
        if (pagination && pagination.current !== currentCmt) {
            setCurrentCmt(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSizeCmt) {
            setPageSizeCmt(pagination.pageSize)
            setCurrentCmt(1);
        }

        // Cuộn về đầu trang
        window.scrollTo({ top: 1000, behavior: 'smooth' });
    }
    
    const fetchProductDetailViewModal = async () => {  
        if (!dataDetailSPModal) { // Chỉ fetch khi dataDetailSP chưa có dữ liệu
          const res = await fetchSPDetail(idDetail);
          console.log("res TL: ", res);
          if (res && res.data) {
            setDataDetailSPModal(res.data);
          }
        }
      }    
  
    useEffect(() => {
        fetchProductDetailViewModal()
    }, [idDetail])
  
    useEffect(() => {
        fetchProductDetail()
    }, [id])

    useEffect(() => {
        handleFindProductToCategory()
    }, [idLoaiSP, current, pageSize, tenSearch])

    useEffect(() => {
        if (dataDetailSP?.sizes.length > 0) {
            // Gán giá trị của size đầu tiên vào selectedItems khi component được mount
            setSelectedItemss(dataDetailSP.sizes[0].price);
        }

        if (dataDetailSP?.sizes.length > 0) {
            // Gán giá trị của size đầu tiên vào selectedItems khi component được mount
            setSelectedSize(dataDetailSP.sizes[0].size);
        }
    }, [dataDetailSP]);


    const handleRedirectLayIdDeXemDetail = (item) => {
        console.log("id: ", item);
        setIdDetail(item)
      }

    const onChangeSizes = (e) => {        
        console.log("value: ", e);
        // setSelectedItemss(e)
        
        const selectedSizeObj = dataDetailSP.sizes.find(item => item._id === e);  // Tìm đối tượng kích thước dựa trên giá
        if (selectedSizeObj) {
            setSelectedItemss(selectedSizeObj.price)
            setSelectedSize(selectedSizeObj.size); // Lưu kích thước (ví dụ: '128gb' hoặc '256gb')
        }
    }
    const onChangeQuantity = (value) => {
        console.log('changed soluong', value);
        setCurrentQuantity(value)
    };

    const imageBaseUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/`;

    // Biến đổi mảng tên file thành các URL ảnh
    const images = dataDetailSP?.ImageSlider?.map(imageName => ({
        original: `${imageBaseUrl}${imageName}`,
        thumbnail: `${imageBaseUrl}${imageName}`,  // Nếu bạn có ảnh thumbnail riêng, thay đổi cho phù hợp
    })) ?? [];


    const handleOnClickImage = () => {        
        refGallery?.current?.fullScreen()
    }

    const handleRedirectLayIdDeXemDetailPageUrl = (item) => {
        console.log("id: ", item);
        // Lấy các _id từ mảng idLoaiSP và chuyển thành chuỗi
        const idLoaiSPString = item.IdLoaiSP.map(loai => loai._id).join(',');
        // navigate(`/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`)
        window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`;
    }    

    const handleAddToCart = async () => {
    
        // Truyền thông tin sản phẩm vào checkProductAvailability
        const availability = await dispatch(
            checkProductAvailability({ dataDetailSP, selectedSize, currentQuantity })
        );
        console.log("availability: ", availability);
    
        if (!availability.payload) {
            // Nếu không đủ số lượng, hiển thị thông báo lỗi                        
            setShowProductImage(false)
            return;
        }
    
        console.log("Số lượng đủ, tiếp tục thêm vào giỏ hàng");
    
        // Thực hiện thêm sản phẩm vào giỏ hàng
        try {
            await dispatch(doAddAction({ dataDetailSP, currentQuantity, discountCode, customerId, selectedItemss, selectedSize }));
            
            setShowProductImage(true);

            setTimeout(() => {
                setShowProductImage(false); // Ẩn hình ảnh sản phẩm bay sau khi hiệu ứng hoàn tất
            }, 1000); // Đợi 1s để hoàn tất hiệu ứng

        } catch (error) {
            // Nếu có lỗi khi thêm vào giỏ hàng, hiển thị thông báo lỗi
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.',
                placement: 'topRight',
            });
        }    
    };
    
    const handleAddToCart2 = async  () => {
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
        dispatch(doAddAction({ dataDetailSP, currentQuantity, discountCode, customerId, selectedItemss, selectedSize }));
    };

    const handleAddWishList = () => {
            
        dispatch(doAddActionWishlist({ dataDetailSP, customerId, selectedItemss, selectedSize }));
    };

    const handleLoginNotification = () => {
        notification.error({
            message: "Không thể viết đánh giá khi chưa đăng nhập!",
            description: (
                <div>
                    Vui lòng tạo tài khoản để có thể đánh giá sản phẩm này!  &nbsp;&nbsp;&nbsp;
                    <a
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            navigate('/login-web')}}
                        style={{
                            // marginTop: '10px',
                            // padding: '5px 10px',
                            // color: '#fff',
                            // backgroundColor: '#1890ff',
                            // border: 'none',
                            // borderRadius: '4px',
                            // cursor: 'pointer',
                            color: "blue"
                        }}
                    >
                        Ấn vào đây để đăng nhập
                    </a>
                </div>
            ),
        });
    };

    const [spinResult, setSpinResult] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const segments = ["Prize 1", "Prize 2", "Prize 3", "Prize 4", "Try Again"];
    const segmentColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33FF", "#FFD700"];
    const onFinished = (winner) => {
        setSpinResult(winner);
        setModalVisible(true);
    };

    const soLuongTonKho = dataDetailSP?.sizes.reduce((total, size) => total + size.quantity, 0)

    return (
        <>
        <div className="rts-navigation-area-breadcrumb bg_light-1">
            <div className="container">
                <div className="row">
                <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                    <a href='#' onClick={() => navigate('/')}>Home</a>
                    <i className="fa-regular fa-chevron-right" />
                    <a className="#">Chi tiết sản phẩm</a>
                    <i className="fa-regular fa-chevron-right" />
                    <a className="current">{dataDetailSP?.TenSP}</a>
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

        <div className="rts-chop-details-area rts-section-gap bg_light-1">
            <div className="container">
                <div className="shopdetails-style-1-wrapper">
                <div className="row g-5">
                    <div className="col-xl-8 col-lg-8 col-md-12">
                        <div className="product-details-popup-wrapper in-shopdetails">
                            <div className="rts-product-details-section rts-product-details-section2 product-details-popup-section">
                            <div className="product-details-popup">
                                <div className="details-product-area">  
                                {/* <Form
                                form={form}
                                name="basic"        
                                layout="vertical"                                           
                                onFinish={handleAddToCart}
                                autoComplete="off"
                                >
                                </Form>                           */}
                                    <Row gutter={[35,20]}>

                                        {/* <Form.Item hidden name="_idSP" ><Input /></Form.Item> */}
                                        

                                        {/* <Col span={10}> */}
                                            {loading ? (
                                                <Col span={10}>
                                                    <Skeleton.Image active />
                                                </Col>
                                            ) : (
                                                <Col span={10}>
                                                    <ImageGallery                       
                                                        ref={refGallery}
                                                        items={images}
                                                        showPlayButton={true} //hide play button
                                                        showFullscreenButton={false} //hide fullscreen button
                                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                                        renderRightNav={() => <></>}//right arrow === <> </>
                                                        slideOnThumbnailOver={true}  //onHover => auto scroll images
                                                        onClick={() => handleOnClickImage()}
                                                    />  
                                                </Col>
                                            )}
                                            {/* <ImageGallery                       
                                                ref={refGallery}
                                                items={images}
                                                showPlayButton={true} //hide play button
                                                showFullscreenButton={false} //hide fullscreen button
                                                renderLeftNav={() => <></>} //left arrow === <> </>
                                                renderRightNav={() => <></>}//right arrow === <> </>
                                                slideOnThumbnailOver={true}  //onHover => auto scroll images
                                                onClick={() => handleOnClickImage()}
                                            />                                 */}
                                        {/* </Col> */}
                                        {loading ? (
                                            <Col span={14}>  
                                                <div className="contents">
                                                    <Skeleton paragraph={{ rows: 5 }} active />     
                                                </div>    
                                            </Col>                                          
                                        ) : (      
                                        <Col span={14} md={14} xs={24} sm={24}>      
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
                                                
                                                <div className="rating-stars-group">
                                                    <div className="rating-star"><i className="fas fa-star" /></div>
                                                    <div className="rating-star"><i className="fas fa-star" /></div>
                                                    <div className="rating-star"><i className="fas fa-star" /></div>
                                                    <div className="rating-star"><i className="fas fa-star" /></div>
                                                    <div className="rating-star"><i className="fas fa-star" /></div>
                                                    <span>{totalCmt} Đánh giá</span>
                                                </div>
                                                </div>
                                                <h2 className="product-title" style={{width: "34vw"}}>{dataDetailSP?.TenSP}</h2>
                                                <p className="mt--20 mb--20">
                                                    <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataDetailSP?.MoTa }} />
                                                </p>
                                                {dataDetailSP?.GiamGiaSP !== 0 ? 
                                                <>
                                                    <span className="product-price mb--15 d-block" style={{color: '#DC2626', fontWeight: 600}}> 
                                                        {Math.ceil(selectedItemss - (selectedItemss * (dataDetailSP?.GiamGiaSP / 100))).toLocaleString()}đ
                                                        <span className="old-price ml--15">
                                                            {selectedItemss.toLocaleString()}đ
                                                        </span>
                                                    </span>
                                                </> 
                                                : 
                                                <>
                                                    <span className="product-price mb--15 d-block" style={{color: '#DC2626', fontWeight: 600}}> 
                                                        {selectedItemss.toLocaleString()}đ                                      
                                                    </span>
                                                </> }
                                                
                                                <div className="variable-product-type mb--15">
                                                <div className="single-select">                                                  
                                                <Row gutter={[10,10]}>
                                                    <Col md={16} xs={24} sm={24}>
                                                    <span className="label">Size</span> 
                                                    <Select
                                                        disabled={soLuongTonKho === 0 ? true : false} 
                                                        placeholder="CHỌN SIZE"
                                                        value={selectedSize}
                                                        onChange={onChangeSizes}
                                                        style={{
                                                            width: '250px',
                                                            height: "50px", 
                                                            marginTop: "20px"
                                                        }}
                                                        options={dataDetailSP?.sizes.map((item) => ({
                                                            value: item._id,
                                                            label: item.size,
                                                        }))}
                                                    />
                                                    &nbsp; 
                                                    </Col>
                                                    <Col md={8} xs={24} sm={24}>
                                                                                                    
                                                    <span className="label" style={{width: "70px"}}>Số lượng: </span>
                                                    <InputNumber size='large' disabled={soLuongTonKho === 0 ? true : false} style={{width: "100px",marginTop: "20px"}} min={1} max={1000} value={currentQuantity} defaultValue={1} onChange={onChangeQuantity} />
                                                    
                                                    </Col>
                                                </Row>
                                                </div>                               
                                                </div>
                                                <div className="product-bottom-action">    
                                                {/* <Form.Item >                                                                                                                               
                                                    <a onClick={() => form.submit()} style={{marginTop: "20px"}} className="rts-btn btn-primary radious-sm with-icon">
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
                                                </Form.Item>                                     */}
                                                <CSSTransition
                                                    in={showProductImage}
                                                    timeout={1000}
                                                    classNames="fly-to-cart"
                                                    unmountOnExit
                                                    onExited={() => setShowProductImage(false)}
                                                >
                                                    <img  className="fly-product-image" src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataDetailSP?.Image}`} alt={dataDetailSP?.TenSP} />
                                                </CSSTransition>
                                                {soLuongTonKho === 0 ? <>
                                                    <Tooltip title="Không thể thêm vào giỏ hàng" color={'green'} key={'green'}>
                                                    <a disabled={soLuongTonKho === 0 ? true : false} style={{marginTop: "20px", backgroundColor: "black", color: "white"}} className="rts-btn btn-primary with-icon">
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
                                                <a  onClick={() => handleAddToCart()} style={{marginTop: "20px"}} className="rts-btn btn-primary radious-sm with-icon">
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
                                                {/* <a  onClick={() => handleAddToCart()} style={{marginTop: "20px"}} className="rts-btn btn-primary radious-sm with-icon">
                                                    <div className="btn-text">
                                                    Thêm vào giỏ hàng
                                                    </div>
                                                    <div className="arrow-icon">
                                                    <i className="fa-regular fa-cart-shopping" />
                                                    </div>
                                                    <div className="arrow-icon">
                                                    <i className="fa-regular fa-cart-shopping" />
                                                    </div>
                                                </a> */}
                                                </div>
                                                <div className="product-uniques">
                                                <span className="sku product-unipue mb--10"><span style={{fontWeight: 400, marginRight: '10px'}}>
                                                    Thương hiệu: 
                                                    </span> {dataDetailSP?.IdHangSX.TenHangSX} </span>
                                                <span className="catagorys product-unipue mb--10">
                                                    <span style={{fontWeight: 400, marginRight: '10px'}}>
                                                    Loại sản phẩm: </span> 
                                                    {dataDetailSP?.IdLoaiSP?.map((item, index) => {
                                                        return (
                                                            <span key={index}>  &nbsp;
                                                            {item.TenLoaiSP}{index < dataDetailSP.IdLoaiSP.length - 1 ? ', ' : ''}
                                                            </span>
                                                        )
                                                    } )}
                                                </span>
                                                <span className="tags product-unipue mb--10">
                                                    <span style={{fontWeight: 400, marginRight: '10px'}}>Giảm giá: </span> 
                                                    <span style={{color: "red"}}>{dataDetailSP?.GiamGiaSP}%</span>
                                                </span>
                                                <span className="tags product-unipue mb--10">
                                                    <span style={{fontWeight: 400, marginRight: '10px'}}>Số lượng đã bán: </span> 
                                                    <span style={{color: "red"}}>{dataDetailSP?.SoLuongBan} </span> sản phẩm
                                                </span>
                                                
                                                </div>
                                                <div className="share-option-shop-details">
                                                <div className="single-share-option" onClick={() => handleAddWishList()}>
                                                    <div className="icon">
                                                    <i className="fa-regular fa-heart" />
                                                    </div>
                                                    <span>Yêu thích</span>
                                                </div>
                                                <div className="single-share-option">
                                                    <div className="icon">
                                                    <i className="fa-solid fa-share" />
                                                    </div>
                                                    <span>Chia sẻ</span>
                                                </div>
                                                <div className="single-share-option">
                                                    <div className="icon">
                                                    <i className="fa-light fa-code-compare" />
                                                    </div>
                                                    <span>So sánh</span>
                                                </div>
                                                </div>
                                            </div>
                                        </Col>
                                        )}
                                    </Row>                                
                                </div>                               
                            </div>
                            </div>
                        </div>
                        <div className="product-discription-tab-shop mt--50">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Chi tiết sản phẩm</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Thông tin bổ sung</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="profile-tabt" data-bs-toggle="tab" data-bs-target="#profile-tab-panes" type="button" role="tab" aria-controls="profile-tab-panes" aria-selected="false">Đánh giá của khách hàng ({totalCmt})</button>
                            </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade   show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex={0}>
                                <div className="single-tab-content-shop-details">
                                    <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataDetailSP?.MoTaChiTiet }} />
                                </div>
                            </div>
                            <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex={0}>
                                <div className="single-tab-content-shop-details">
                                {/* <p className="disc">x</p> */}
                                <div className="table-responsive table-shop-details-pd">
                                    <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Thông số chi tiết</th>
                                            <th>Giá tương ứng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataDetailSP?.sizes?.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{item.size}</td>
                                                    <td>{item.price.toLocaleString()}đ</td>
                                                </tr>
                                            )
                                        })}                                                                                                             
                                    </tbody>
                                    </table>
                                </div>
                                <p className="cansellation mt--20">
                                    <span> Trả hàng/hủy hàng:</span> 
                                    Không áp dụng đổi hàng đã giao cho khách hàng. Nếu phát hiện vấn đề về chất lượng hoặc số lượng sản phẩm, khách hàng có thể trả hàng/hủy đơn hàng khi có mặt người giao hàng.
                                </p>
                                <p className="note">
                                    <span>Lưu ý:</span> Thời gian giao sản phẩm có thể thay đổi tùy theo tình trạng còn hàng trong kho.
                                </p>
                                <div                           
                                    className="youtube-video"
                                    dangerouslySetInnerHTML={{ __html: dataDetailSP?.urlYoutube }}
                                />
                                {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/pkcPnTf0BVY?si=LW4D0m9jZMWmJDCr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
                                </div>
                            </div>

                            <div className="tab-pane fade" id="profile-tab-panes" role="tabpanel" aria-labelledby="profile-tabt" tabIndex={0}>
                                <div className="single-tab-content-shop-details">
                                <div className="product-details-review-product-style">
                                    <div className="average-stars-area-left">                                
                                        <div className="review-charts-details">
                                            <Row gutter={[35,20]}>
                                                <h3></h3>
                                                <Col md={12} sm={12} xs={12} style={{position: "relative", left: 10}}>
                                                    <span>
                                                        <Rate value={5} disabled style={{display: "inline-block"}} /> &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className='txt-count-sao'>{starCount[5] || 0} &nbsp; Luợt đánh giá</span>
                                                    </span> <br/>
                                                    <span>
                                                        <Rate value={4} disabled style={{display: "inline-block"}} /> &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className='txt-count-sao'>{starCount[4] || 0} &nbsp; Luợt đánh giá</span>
                                                    </span> <br/>
                                                    <span>
                                                        <Rate value={3} disabled style={{display: "inline-block"}} /> &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className='txt-count-sao'>{starCount[3] || 0} &nbsp; Luợt đánh giá</span>
                                                    </span> <br/>
                                                    <span>
                                                        <Rate value={2} disabled style={{display: "inline-block"}} /> &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className='txt-count-sao'>{starCount[2] || 0} &nbsp; Luợt đánh giá</span>
                                                    </span> <br/>
                                                    <span>
                                                        <Rate value={1} disabled style={{display: "inline-block"}} /> &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className='txt-count-sao'>{starCount[1] || 0} &nbsp; Luợt đánh giá</span>
                                                    </span>                                           
                                                    <br/>
                                                    <Divider/>
                                                </Col>

                                                <Col md={12} sm={24} xs={24} style={{position: "relative", left: 10}}>                                                                                                
                                                    <Form
                                                        form={formComment}
                                                        className="submit-review-area"                                
                                                        // layout="vertical"    
                                                        style={{width: "800px"}}                           
                                                        onFinish={handleComment} 
                                                    >
                                                        <h3 className="title">Đánh giá tại đây</h3>                                    
                                                        <Row gutter={[10,5]}>
                                                            <Col span={24} md={24} sm={24} xs={24}>
                                                                <Form.Item
                                                                    label="Đánh giá của bạn về sản phẩm này:"
                                                                    name="rating"
                                                                    rules={[{ required: true, message: 'Vui lòng chọn đánh giá sao!' }]} // Bắt buộc người dùng phải chọn đánh giá sao
                                                                >
                                                                    <Rate tooltips={tooltips} className='ratee' />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={24} md={24} sm={24} xs={24}>
                                                                <Form.Item
                                                                    label="Viết đánh giá"                                        
                                                                    name="note"                                                
                                                                    rules={[
                                                                        {
                                                                            required: false,
                                                                            // message: 'Vui lòng nhập đầy đủ thông tin!',
                                                                        },  
                                                                                                            
                                                                    ]}
                                                                    hasFeedback
                                                                >
                                                                    <Input.TextArea style={{ width: "100%", maxWidth: 400 }}  placeholder="abc"  autoSize={{ minRows: 5, maxRows: 10000 }} />
                                                                </Form.Item>
                                                            </Col>                                                                                
                                                        </Row>
                                                    </Form>   
                                                    <Row style={{position: "relative", alignItems:"center"}}>
                                                        {isAuthenticated ? <>
                                                            <Col span={16} xs={24} sm={24} style={{margin: "auto"}}>
                                                                <button style={{color: "white"}} onClick={() => formComment.submit()} className="rts-btn btn-primary">Bình Luận</button>
                                                            </Col>
                                                        </> : <>
                                                            <Col span={16} xs={24} sm={24} style={{margin: "auto"}}>
                                                                <button style={{color: "white"}} onClick={() => handleLoginNotification()} className="rts-btn btn-primary">Bình Luận</button>
                                                            </Col>
                                                        </>}
                                                    </Row>
                                                </Col>

                                                <Col md={24} sm={24} xs={24}>                                        
                                                    {dataComment?.map((item, index) => {
                                                        return (
                                                            <>
                                                                <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item?.idKH?.image}`} size={60} icon={<UserOutlined />} />
                                                                <span style={{paddingLeft: "15px", fontWeight: "bold", fontSize: "20px"}}>{item?.idKH?.fullName} </span> &nbsp;<br/>
                                                                <span
                                                                style={{
                                                                    position: "relative",
                                                                    left: 70,
                                                                    fontSize: "18px",
                                                                    maxWidth: "500px", // Giới hạn chiều rộng tối đa
                                                                    wordWrap: "break-word", // Tự động xuống dòng
                                                                    whiteSpace: "normal", // Cho phép xuống dòng
                                                                    display: "block", // Hiển thị như block để áp dụng maxWidth hiệu quả
                                                                }}                                                               
                                                                >
                                                                ( {new Date(item.createdAt).toLocaleString()})
                                                                </span>
                                                                
                                                                {customerId === item?.idKH?._id ? 
                                                                <Tooltip title="xóa bình luận này" color={'green'} key={'green'}>
                                                                    <RiDeleteBin6Line 
                                                                    onClick={() => handleDeleteComment(item?._id)}
                                                                    style={{color: "red", cursor: "pointer", position: "relative", left: 100}} 
                                                                    size={25} /> 
                                                                </Tooltip>
                                                                : ''}
                                                                <Rate style={{position: "relative", left: 70}} value={item?.soSaoDanhGia} disabled />                                                                         
                                                                <span 
                                                                style={{
                                                                    position: "relative",
                                                                    left: 70,
                                                                    fontSize: "18px",
                                                                    maxWidth: "500px", // Giới hạn chiều rộng tối đa
                                                                    wordWrap: "break-word", // Tự động xuống dòng
                                                                    whiteSpace: "normal", // Cho phép xuống dòng
                                                                    display: "block", // Hiển thị như block để áp dụng maxWidth hiệu quả
                                                                }}
                                                                >{item?.title}</span>      
                                                                <Divider/>                                                                                                           
                                                            </>
                                                        )
                                                    })}
                                                </Col>   

                                                {totalCmt !== 0 ? <>
                                                <Col span={24} style={{margin: "auto"}}>
                                                    <Pagination                                                                              
                                                        responsive
                                                        current={currentCmt}
                                                        pageSize={pageSizeCmt}
                                                        total={totalCmt}
                                                        onChange={(p, s) => handleOnchangePageCMT({ current: p, pageSize: s })} // Gọi hàm onChangePagination khi thay đổi trang
                                                        // onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                                                        showSizeChanger={true}
                                                        showQuickJumper={true}
                                                        showTotal={(total, range) => (
                                                            <div>{range[0]}-{range[1]} trên {total} bình luận</div>
                                                        )}
                                                        locale={{
                                                            items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                                            jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                                            jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                                            page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                                                        }}
                                                    /> 
                                                </Col>                                                                   
                                                </> : ''}    

                                            </Row>                                            
                                        </div>
                                    </div>


                                    <div className="submit-review-area">
                                    {/* <Form
                                        form={formComment}
                                        className="submit-review-area"                                
                                        // layout="vertical"    
                                        style={{width: "800px"}}                           
                                        onFinish={handleComment} 
                                    >
                                        <h5 className="title">Đánh giá tại đây</h5>                                    
                                        <Row gutter={[10,5]}>
                                            <Col span={24} md={24} sm={24} xs={24}>
                                                <Form.Item
                                                    label="Đánh giá của bạn về sản phẩm này:"
                                                    name="rating"
                                                    rules={[{ required: true, message: 'Vui lòng chọn đánh giá sao!' }]} // Bắt buộc người dùng phải chọn đánh giá sao
                                                >
                                                    <Rate className='ratee' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24} md={24} sm={24} xs={24}>
                                                <Form.Item
                                                    label="Viết đánh giá"                                        
                                                    name="note"                                                
                                                    rules={[
                                                        {
                                                            required: false,
                                                            // message: 'Vui lòng nhập đầy đủ thông tin!',
                                                        },  
                                                                                            
                                                    ]}
                                                    hasFeedback
                                                >
                                                    <Input.TextArea placeholder="abc"  autoSize={{ minRows: 3, maxRows: 10000 }} />
                                                </Form.Item>
                                            </Col>                                                                                
                                        </Row>
                                    </Form>   
                                    <Row>
                                        {isAuthenticated ? <>
                                            <Col span={16} style={{margin: "auto"}}>
                                                <button onClick={() => formComment.submit()} className="rts-btn btn-primary">Bình Luận</button>
                                            </Col>
                                        </> : <>
                                            <Col span={16} style={{margin: "auto"}}>
                                                <button onClick={() => handleLoginNotification()} className="rts-btn btn-primary">Bình Luận</button>
                                            </Col>
                                        </>}
                                    </Row> 
                                    <br/>  */}   
                                    {/* <Row gutter={[10,5]} style={{width: "100%"}}>                         
                                    {totalCmt !== 0 ? <>
                                        <Col span={24} style={{margin: "auto"}}>
                                            <Pagination                                                                              
                                                responsive
                                                current={currentCmt}
                                                pageSize={pageSizeCmt}
                                                total={totalCmt}
                                                onChange={(p, s) => handleOnchangePageCMT({ current: p, pageSize: s })} // Gọi hàm onChangePagination khi thay đổi trang
                                                // onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                                                showSizeChanger={true}
                                                showQuickJumper={true}
                                                showTotal={(total, range) => (
                                                    <div>{range[0]}-{range[1]} trên {total} bình luận</div>
                                                )}
                                                locale={{
                                                    items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                                    jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                                    jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                                    page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                                                }}
                                            /> 
                                        </Col>                                                                   
                                        </> : ''}
                                        </Row> */}
                                    </div>


                                </div>
                                </div>
                            </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-4 offset-xl-1  rts-sticky-column-item" style={{zIndex: 100}}>
                        <div className="theiaStickySidebar">
                            <div className="shop-sight-sticky-sidevbar  mb--20">
                            <h6 className="title">Các ưu đãi có sẵn</h6>
                            <div className="single-offer-area">
                                <div className="icon">
                                <img src={svg01} alt="icon" />
                                </div>
                                <div className="details">
                                <p>Hỗ trợ cho thuê game ngắn hạn.</p>
                                </div>
                            </div>
                            <div className="single-offer-area">
                                <div className="icon">
                                <img src={svg02} alt="icon" />
                                </div>
                                <div className="details">
                                <p>Ưu đãi hơn cho khách đăng ký thành viên Tigar</p>
                                </div>
                            </div>
                            <div className="single-offer-area">
                                <div className="icon">
                                <img src={svg03} alt="icon" />
                                </div>
                                <div className="details">
                                <p>Miễn phí vận chuyển toàn quốc áp dụng cho các đơn mua hàng trên 300k</p>
                                </div>
                            </div>
                            </div>
                            <div className="our-payment-method">
                            <h5 className="title">Zalo CSKH: 092.616.9374 </h5>
                            <img src={png03} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

        {/* rts grocery feature area start */}
        <div className="popular-product-col-7-area rts-section-gapBottom ">
        <div className="container cover-card-main-over-white mt--60 ">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-area-between mb--15" style={{justifyContent: "center"}}>
                <h2 className="title-left" style={{color: "navy"}}>
                Sản phẩm liên quan
                </h2>               
              </div>
            </div>
          </div>
          <div className="row plr--30 plr_sm--5">
            <div className="col-lg-12">
              <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id={`home`} role="tabpanel" aria-labelledby={`home-tab`}>
                      <div className="row g-4 mt--0">
                      {dataProductToCategory?.length === 0 ? (
                        <div className="col-12">
                          <p style={{color: "red", fontSize: "25px", textAlign: "center"}}>
                          <IoWarningOutline size={100} />
                            Chưa có sản phẩm nào cả! </p>
                        </div>
                      ) : (
                        dataProductToCategory.map((item, index) => {
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
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.Image}`} alt="grocery" />
                                  </a>
                                  <div className="action-share-option">
                                    <div onClick={() => handleAddWishList()} className="single-action openuptip message-show-action" data-flow="up" title="Danh sách yêu thích">
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
                                    <h4 className="title" >{item.TenSP}</h4>
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
                                  <div className="cart-counter-action css-btn" >
                                    <a style={{cursor:"pointer"}} onClick={() => handleRedirectLayIdDeXemDetailPageUrl(item)} className="rts-btn btn-primary radious-sm with-icon">
                                      <div className="btn-text">
                                      Xem sản phẩm
                                      </div>
                                      <div className="arrow-icon">
                                        {/* <i className="fa-regular fa-cart-shopping" /> */}
                                        <i className="fa-regular fa-eye" />
                                      </div>
                                      {/* <div className="arrow-icon">
                                        <i className="fa-regular fa-cart-shopping" />
                                      </div> */}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )} 

                      <Row style={{justifyContent: "center"}}>
                            <Pagination                                         
                                responsive
                                current={current}
                                pageSize={pageSize}
                                total={total}
                                onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })} // Gọi hàm onChangePagination khi thay đổi trang
                                // onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                                showSizeChanger={true}
                                showQuickJumper={true}
                                showTotal={(total, range) => (
                                    <div>{range[0]}-{range[1]} trên {total} sản phẩm</div>
                                )}
                                locale={{
                                    items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                    jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                    jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                    page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                                }}
                            />                            
                        </Row>                    
                      </div>
                    </div>                
              </div>
            </div>
          </div>
        </div>
        </div>
        {/* rts grocery feature area end */}

        <ModalViewDetail
        openDetail={openDetail}
        setOpenDetail={setOpenDetail}
        setDataDetailSP={setDataDetailSPModal}
        setIdDetail={setIdDetail}
        dataDetailSP={dataDetailSPModal}
        />

        <div className="rts-shorts-service-area rts-section-gap bg_primary">
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

        </>
    )
}

export default DetailProduct
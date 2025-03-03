import { RiDeleteBin6Line, RiDiscountPercentFill } from "react-icons/ri"
import { Avatar, Button, Card, Col, Divider, Flex, Form, Input, message, Modal, notification, Popconfirm, Row, Space, Switch, Table, Tag, Tooltip, Upload, Typography  } from 'antd';
import { IoCopy, IoDiamondSharp, IoGift } from "react-icons/io5";
import { MdEmail, MdOutlineCancel, MdOutlineProductionQuantityLimits, MdOutlineShoppingCartCheckout } from "react-icons/md";
import imgVoucher from '../../assets/images/869649.png'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doiThongTinKH, fetchOneAccKH } from "../../services/accKhAPI";
import { useEffect, useState } from "react";
import { handleLogout } from "../../services/loginKHAPI";
import { doLogoutAction } from "../../redux/accKH/accountSlice";
import { doLogoutActionCart } from "../../redux/order/orderSlice";
import { doLoginActionWishlist } from "../../redux/wishlist/wishlistSlice";
import { FaAddressCard, FaCartPlus, FaCrown, FaEye, FaLink, FaPhone, FaRegAddressCard, FaSave, FaStar, FaTrophy } from "react-icons/fa";
import Password from "antd/es/input/Password";
import bcrypt from 'bcryptjs-react';
import { CheckCircleOutlined, CrownOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, HourglassOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import { uploadImg } from "../../services/uploadAPI";
import { handleHuyOrder, historyOrderByIdKH } from "../../services/orderAPI";
// import moment from "moment/moment";
import moment from 'moment-timezone';
import DrawerViewOrder from "./DrawerViewOrder";
import { TbPasswordUser } from "react-icons/tb";
const { Text } = Typography;
import { FaUser } from "react-icons/fa";

const Account = () => {

    const navigate = useNavigate()
    const customerId = useSelector(state => state.accountKH.user._id)
    const user = useSelector(state => state.accountKH.user)

    const dispatch = useDispatch();
    const [sortQuery, setSortQuery] = useState("sort=createdAt");
    const [dataAccKH, setDataAccKH] = useState(null)
    const [dataAcc, setDataAcc] = useState(null)
    const [dataOrderHistory, setDataOrderHistory] = useState(null)
    const [loading, setLoading] = useState(false);
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState('');    
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const [dataOrder, setDataOrder] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)

    const [openViewDH, setOpenViewDH] = useState(false)
    const [dataViewDH, setDataViewDH] = useState(null)

    const [soLuongDonThanhCong, setSoLuongDonThanhCong] = useState(0)
    const [tongDoanhThuThanhCong, setTongDoanhThuThanhCong] = useState(0)

    const [formAcc] = Form.useForm()

    const handleDoiTT = async (values) => {

        const {
            _idAcc, fullName, email, phone, address, password, passwordMoi
        } = values
        console.log("password: ", password);
        console.log("fullName, email, phone, address, passwordMoi: ", fullName, email, phone, address, passwordMoi);

        const matKhauCu = dataAcc?.password
        console.log("mk cu: ", matKhauCu);
        
        const isMatch = await bcrypt.compare(password, matKhauCu); // So sánh password nhập vào với mật khẩu đã mã hóa

        const hinhAnh = imageUrl.split('/').pop();
        console.log("hinhAnh: ",hinhAnh);
        

        if (isMatch) {
            console.log("Mật khẩu cũ chính xác. Cập nhật mật khẩu mới...");

            const res = await doiThongTinKH(_idAcc, fullName, email, phone, address, passwordMoi, hinhAnh)
            if(res && res.data) {
                message.success(res.message)
                message.success('Yêu cầu đăng nhập lại!')
                setImageUrl('')
                dispatch(doLogoutAction())
                dispatch(doLogoutActionCart())
                dispatch(doLoginActionWishlist())
            } else {
                notification.error({ 
                    message: "Đổi thông tin thất bại!",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5,
                });
            }

        } else {
            notification.error({
                message: "Mật khẩu cũ không chính xác",
                description: "Vui lòng nhập lại mật khẩu cũ đúng."
            });
        }

    }
    console.log("dataAcc: ", dataAcc);
    console.log("dataAccKH: ", dataAccKH);

    const fetchOneAcc = async () => {
        let id = `id=${customerId}`
        const res = await fetchOneAccKH(id)
        console.log("res voucher tk: ", res.data);
        
        if (res && res.data) {
            setDataAccKH(res.data)            
            setDataAcc(res.data?.[0])     
            setSoLuongDonThanhCong(res.soLuongDonThanhCong)       
            setTongDoanhThuThanhCong(res.tongDoanhThuThanhCong)       
        }
    }

    useEffect(() => {
        if (dataAcc) {     
            if (dataAcc.image) {    
                setFileList([
                    {
                        uid: uuidv4(),
                        name: dataAcc.image, // Tên file
                        status: 'done', // Trạng thái
                        url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataAcc.image}`, // Đường dẫn đến hình ảnh
                    },
                ]);
            }              
            const init = {
                _idAcc: dataAcc?._id,                
                fullName: dataAcc?.fullName,                
                email: dataAcc?.email,                
                phone: dataAcc?.phone,                
                address: dataAcc?.address,                                
                image: dataAcc?.image,                                
            }
            console.log("init: ", init);
            setImageUrl(dataAcc?.image)    
            formAcc.setFieldsValue(init);            
        }
        return () => {
            formAcc.resetFields();
        }
    },[dataAcc])

    useEffect(() => {
        fetchOneAcc()
    },[customerId])   
    
    const logoutClick = async () => {
        const res = await handleLogout()
        if(res) {
          dispatch(doLogoutAction())
          dispatch(doLogoutActionCart())
          dispatch(doLoginActionWishlist())
          message.success(res.message)
          navigate('/')
        }
    }

    // upload ảnh    
    const handleUploadFileImage = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await uploadImg(file);
            console.log("res upload: ", res);            
            if (res) {
                setImageUrl(res.url); // URL của hình ảnh từ server
                onSuccess(file);
                setFileList([ // Đặt lại fileList chỉ chứa file mới
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: res.url, // URL của hình ảnh từ server
                    },
                ]);
                // setDataImage()
                message.success('Upload thành công');
            } else {
                onError('Đã có lỗi khi upload file');
            }            
        } catch (error) {
            console.error(error);
            message.error('Upload thất bại');
            onError(error);
        } finally {
            setLoading(false);
        }
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên hình ảnh JPG/PNG!');
        }
        return isJpgOrPng;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`upload file ${info.file.name} thành công`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload file thất bại!`);
        }
    };
    const handleRemoveFile = (file) => {
        setFileList([]); // Reset fileList khi xóa file
        setImageUrl(''); // Reset URL khi xóa file
        message.success(`${file.name} đã được xóa`);
    };
    // mở đóng modal hình ảnh
    const handlePreview = async (file) => {
        setImageUrl(fileList[0].url); // Lấy URL của hình ảnh
        setIsModalVisible(true); // Mở modal
    };

    const linkTTGH = (item) => {
        window.open(item, '_blank');
    }

    const findAllOrder = async () => {
        setLoadingOrder(true)
        let query = `page=${current}&limit=${pageSize}&idKH=${customerId}`
        if (sortQuery) {
            query += `&${sortQuery}`;
        } 
        let res = await historyOrderByIdKH(query)
        console.log("res his order: ", res);
        if(res && res.data) {
            setDataOrder(res.data?.findOrder)
            setTotal(res.data?.totalOrder)
        }
        setLoadingOrder(false)
    }

    useEffect(() => {
        findAllOrder()
    },[customerId, current, pageSize, sortQuery])

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: '_id',
            key: '_id',
            render: (text) => <span style={{fontWeight: "bold"}}>#{text.slice(-6)}</span>, // Lấy 6 ký tự cuối cùng
            width: 50
        },
        {
            title: 'ngày đặt đơn',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, record) => {
                return (
                    // <>{moment(record.createdAt).format('DD-MM-YYYY  (hh:mm:ss)')}</>
                    <>{moment(record.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY (HH:mm:ss)')}</>
                )
            },
            sorter: true
        },        
        {
          title: <span style={{justifyContent: "center", display: "flex"}}>trạng thái</span>,
          key: 'status',
          dataIndex: 'status',
          render: (text, record) => {            
            // Hàm lấy màu và icon cho TinhTrangDonHang
            const getStatusTagForTinhTrangDonHang = (status) => {
                if (status === "Chưa giao hàng") {
                    return { color: 'red', icon: <ExclamationCircleOutlined /> };
                }
                if (status === "Đang giao hàng") {
                    return { color: 'orange', icon: <HourglassOutlined /> };
                }
                return { color: 'blue', icon: <CheckCircleOutlined /> }; // "Đã giao hàng"
            };
        
            // Hàm lấy màu và icon cho TinhTrangThanhToan
            const getStatusTagForTinhTrangThanhToan = (status) => {
                return status === "Chưa Thanh Toán"
                ? { color: 'red', icon: <ExclamationCircleOutlined /> }
                : { color: 'green', icon: <CheckCircleOutlined /> }; // "Đã Thanh Toán"
            };
        
            const donHangTag = getStatusTagForTinhTrangDonHang(record.TinhTrangDonHang);
            const thanhToanTag = getStatusTagForTinhTrangThanhToan(record.TinhTrangThanhToan);
            return (
                <div style={{justifyContent: "center", display: "flex"}}>      
                    {record?.TrangThaiHuyDon === 'Không Hủy' ? (
                        record?.TinhTrangDonHang === 'Đã giao hàng' && record?.TinhTrangThanhToan === 'Đã Thanh Toán' ? 
                            <Tag color='green' icon={<CheckCircleOutlined />}>Đơn hàng giao thành công</Tag> : 
                        <>
                            <Tag color={donHangTag.color} icon={donHangTag.icon}>
                                {record.TinhTrangDonHang}
                            </Tag>
                            <Tag color={thanhToanTag.color} icon={thanhToanTag.icon}>
                                {record.TinhTrangThanhToan}
                            </Tag>
                        </>                        
                    ) : (
                        record?.TinhTrangThanhToan === 'Chờ hoàn tiền' ? 
                        <>
                            <Tag color='default' icon={<CheckCircleOutlined />}>{record?.TrangThaiHuyDon}</Tag>
                            <Tag color={'warning'} icon={<ExclamationCircleOutlined />}>
                                {record.TinhTrangThanhToan}
                            </Tag>                           
                        </>  :  <Tag color='default' icon={<CheckCircleOutlined />}>{record?.TrangThaiHuyDon}</Tag>
                    ) }                    
                </div>
            );
          },
        },
        {
            title: 'TỔNG',
            dataIndex: 'total',
            key: 'total',
            render: (text, record) => {                
                return (
                    <>
                        <span>Đã đặt {record.tongSoLuong} sản phẩm</span> <br/>
                        <span>Tổng <span style={{color: "red"}}>{Math.ceil(record.soTienCanThanhToan).toLocaleString()} VNĐ</span> </span> 
                    </>
                );
            },
        },
        {
          title: 'chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <Tooltip title="Xem tình trạng giao hàng" color={'green'} key={'green'}>
                    <FaLink onClick={() => linkTTGH(record?.urlTTGH)} size={20} style={{color: "navy", fontWeight: "bold", cursor: "pointer", fontSize: "18px"}}  />
                </Tooltip>
                <Tooltip title="Xem đơn hàng này" color={'green'} key={'green'}>

                    <FaEye size={23} style={{color: "green", fontWeight: "bold", cursor: "pointer", fontSize: "18px"}} 
                        onClick={() => {
                            console.log("record: ", record);    
                            setOpenViewDH(true)    
                            setDataViewDH(record)                             
                        }} 
                    />
                </Tooltip>

                {record.TinhTrangDonHang === 'Chưa giao hàng' && record.TinhTrangThanhToan === 'Đã Thanh Toán' && record?.TrangThaiHuyDon === 'Không Hủy' ? 
                <Tooltip title="Hủy đơn hàng này" color={'green'} key={'green'}>
                    <MdOutlineCancel onClick={() => huyDonHang(record?._id)} style={{color: "red"}} size={23} />                                           
                </Tooltip>  : ''
                }

                {record.TinhTrangDonHang === 'Chưa giao hàng' && record.TinhTrangThanhToan === 'Chưa Thanh Toán' && record?.TrangThaiHuyDon === 'Không Hủy' ? 
                <Tooltip title="Hủy đơn hàng này" color={'green'} key={'green'}>
                    <MdOutlineCancel onClick={() => huyDonHang(record?._id)} style={{color: "red"}} size={23} />                                           
                </Tooltip>  : ''
                }                               

                {/* <Tooltip title="Hủy đơn hàng này" color={'green'} key={'green'}>
                    <MdOutlineCancel onClick={() => alert('xoa')} style={{color: "red"}} size={23} />                                           
                </Tooltip>                 */}
            </Space>
          ),
        },
    ];   

    const huyDonHang = async (id) => {
        let res = await handleHuyOrder(id)
        if(res && res.data) {
            message.success(res.message)
            await findAllOrder()
        } else {
            notification.error({
                message: 'Hủy đơn hàng không thành công!',
                description: res.message
            })
        } 
    }
    
    const onChange = (pagination, filters, sorter, extra) => {
        console.log(">> check: pagination", pagination);
    
        // nếu thay dổi trang: current
        if(pagination && pagination.current){
          if( +pagination.current !== +current){
            setCurrent( +pagination.current) // ví dụ "5" -> 5
          }
        }
    
        // nếu thay đổi tổng số phần tử
        if(pagination && pagination.current){
          if( +pagination.pageSize !== +pageSize){
            setPageSize( +pagination.pageSize) // ví dụ "5" -> 5
          }
        }

        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        }
    
        window.scrollTo({ top: 80, behavior: "smooth" });
      }

    const renderMemberRank = (hangTV) => {
        switch (hangTV) {
            case "Bạc":
                return (
                    <>
                        <FaTrophy size={30} style={{ color: "#CD7F32", marginRight: 8 }} />
                        <span style={{ color: 'navy', fontSize: '20px', color: '#696969' }}>Hiện tại: Tigar Bạc</span>
                        <Text style={{ display: 'block', color: 'red', fontSize: '20px' }}>
  
</Text>

{/* Hiển thị hiệu tuyệt đối giữa tongDoanhThuThanhCong và 1.000.000 */}
<Text style={{ fontSize: '16px', marginTop: '8px' }}>
  Tích luỹ thêm <Text style={{ color: 'red' }}>
    {Math.abs(tongDoanhThuThanhCong - 1000000).toLocaleString('vi-VN')}đ
  </Text> để thăng hạng Tigar Vàng{' '}
  
</Text>
<Text style={{ fontSize: '14px', marginTop: '8px' }}>
  (Ưu đãi Tigar Vàng: Giảm 5% tổng đơn){' '}
  
</Text>
                        
                    </>
                );
            case "Vàng":
                return (
                    <>
                        <FaCrown size={30} style={{ color: "gold", marginRight: 8 }} />
                        <span style={{ color: 'navy', fontSize: '20px', color: '#FFD700' }}>Tigar Vàng</span>
                        <Text style={{ fontSize: '16px', marginTop: '8px' }}>
  Tích luỹ thêm <Text style={{ color: 'red' }}>
    {Math.abs(tongDoanhThuThanhCong - 5000000).toLocaleString('vi-VN')}đ
  </Text> để thăng hạng Tigar Bạch Kim{' '}
  
</Text>
                    </>
                );
            case "Bạch Kim":
                return (
                    <>
                        <FaStar size={30} style={{ color: "#E5E4E2", marginRight: 8 }} />
                        <span style={{ color: 'navy', fontSize: '20px', color: '#999B9B' }}>Tigar Bạch Kim</span>
                        <Text style={{ fontSize: '16px', marginTop: '8px' }}>
  Tích luỹ thêm <Text style={{ color: 'red' }}>
    {Math.abs(tongDoanhThuThanhCong - 20000000).toLocaleString('vi-VN')}đ
  </Text> để thăng hạng Tigar Kim Cương{' '}
  
</Text>

                    </>
                );
            case "Kim Cương":
                return (
                    <>
                        <IoDiamondSharp size={30} style={{ color: "#00BFFF", marginRight: 8 }} />
                        <span style={{ color: 'navy', fontSize: '20px', color: '#00bfff' }}>Tigar Kim Cương</span>
                    </>
                );
            default:
                return (
                    <>
                        <FaTrophy size={30} style={{ color: "#CD7F32", marginRight: 8 }} />
                        <span style={{ color: 'navy', fontSize: '20px', color: '#ff6600' }}>Tigar Bạc</span>
                    </>
                );
        }
    };

    return (
        <>
        <div className="rts-navigation-area-breadcrumb">
            <div className="container-2">
                <div className="row">
                <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                    <a>Home</a>
                    <i className="fa-regular fa-chevron-right" />
                    <a className="current">Tài khoản của tôi</a>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="account-tab-area-start rts-section-gap">
            <div className="container-2">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="nav accout-dashborard-nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false"><i className="fa-regular fa-bag-shopping" />Lịch sử đơn hàng</button>
                            <button className="nav-link" id="v-pills-settingsa-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settingsa" type="button" role="tab" aria-controls="v-pills-settingsa" aria-selected="false"><i className="fa-light fa-user" />Thông tin tài khoản</button>
                            <button className="nav-link" id="v-pills-settingsa-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settingdoimatkhau" type="button" role="tab" aria-controls="v-pills-settingdoimatkhau" aria-selected="false"><TbPasswordUser size={20} /> Thay đổi thông tin tài khoản</button>
                            <button className="nav-link" id="v-pills-settings-tab" onClick={() => message.success(`Bạn đang có ${dataAcc?.quayMayManCount} lượt quay vòng quay may mắn`)} role="tab" aria-controls="v-pills-settings" aria-selected="false"><IoGift size={20} />Số lượt quay thưởng &nbsp; ({dataAcc?.quayMayManCount})</button>
                            <button className="nav-link " id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true"><RiDiscountPercentFill size={20} />Mã giảm giá</button>
                            <button className="nav-link" id="v-pills-settingsb-tab" type="button" role="tab"><a onClick={() => logoutClick()}><i className="fa-light fa-right-from-bracket" />Đăng xuất</a></button>
                        </div>
                    </div>

                    <div className="col-lg-9 pl--50 pl_md--10 pl_sm--10 pt_md--30 pt_sm--30">
                        <div className="tab-content" id="v-pills-tabContent">
                            {/* Vouchers */}
                            <div className="tab-pane fade  " id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabIndex={0}>
                                <div className="dashboard-account-area">
                                    <Row gutter={[30,30]}>
                                    {dataAccKH?.[0]?.IdVoucher?.length > 0 ? (
                                            dataAccKH[0].IdVoucher.map((item, index) => {
                                                return (
                                                    <Col span={8} key={index}>
                                                        <Card
                                                            actions={[
                                                                <Tooltip title="Sao chép voucher" color={'green'} key={'green'}>
                                                                    <IoCopy
                                                                        size={25}
                                                                        onClick={() => {
                                                                        // Sao chép mã voucher vào clipboard
                                                                        navigator.clipboard.writeText(item.code)
                                                                            .then(() => {
                                                                            message.success(`Voucher ${item.code} đã được sao chép!`);
                                                                            })
                                                                            .catch(() => {
                                                                            message.error("Lỗi khi sao chép voucher!");
                                                                            });
                                                                        }}
                                                                    />
                                                                </Tooltip>,
                                                                <Tooltip title="Đi tới giỏ hàng" color={'green'} key={'green'}>
                                                                    <MdOutlineShoppingCartCheckout onClick={() => navigate('/mycart')} size={25} key="checkout" />
                                                                </Tooltip>,
                                                            ]}
                                                            style={{
                                                                minWidth: 300,
                                                            }}
                                                            hoverable
                                                        >
                                                            <Avatar size={70} src={imgVoucher} />
                                                            <span style={{ paddingLeft: "20px", fontSize: "20px", fontWeight: "500", color: "blue" }}>
                                                                {item.code} {/* Assuming voucher code is in `item.code` */}
                                                            </span> 
                                                            <br />
                                                            <span style={{ fontSize: "16px" }}>
                                                                Điều kiện: Giá trị đơn hàng trên <span style={{ color: "red" }}> {parseInt(item.dieuKien).toLocaleString()}đ</span>
                                                            </span> 
                                                            <br />
                                                            <span style={{ fontSize: "16px" }}>
                                                                Được giảm: <span style={{ color: "red" }}>{item.giamGia}%</span>
                                                            </span>
                                                            <br />
                                                            <span style={{ fontSize: "16px" }}>
                                                                Ngày hết hạn: <span style={{ color: "red" }}>{item.thoiGianHetHan}</span>
                                                            </span>
                                                        </Card>
                                                    </Col>
                                                );
                                            })
                                        ) : (
                                            <div>Chưa có mã giảm giá</div>
                                        )
                                    }                                                                               
                                    </Row>
                                </div>                                
                            </div>

                            <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabIndex={0}>
                                <div className="order-table-account">
                                <div className="h3 title">Đơn Hàng Của &nbsp;&nbsp;&nbsp;<span style={{color: "green"}}>{user?.fullName}</span></div>
                                <div className="table-responsive">
                                    <Table 
                                    onChange={onChange}
                                    pagination={{
                                        current: current,
                                        pageSize: pageSize,
                                        showSizeChanger: true,
                                        total: total,
                                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} đơn hàng</div>) }
                                    }}
                                    //  pagination={false}  // Tắt phân trang mặc định của Table
                                    loading={loadingOrder} 
                                    columns={columns} 
                                    dataSource={dataOrder} />                                    
                                </div>
                                </div>

                                <DrawerViewOrder
                                openViewDH={openViewDH}
                                dataViewDH={dataViewDH}
                                setOpenViewDH={setOpenViewDH}
                                setDataViewDH={setDataViewDH}
                                />
                            </div>

                            <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabIndex={0}>
                                <div className="tracing-order-account">
                                <h2 className="title">Orders tracking</h2>
                                <p>
                                    To keep up with the status of your order, kindly input your OrderID in the designated box below and click the "Track" button. This unique identifier can be found on your receipt as well as in the confirmation email that was sent to you.
                                </p>
                                <form action="#" className="order-tracking">
                                    <div className="single-input">
                                    <label htmlFor="order-id">Order Id</label>
                                    <input type="text" placeholder="Found in your order confirmation email" required />
                                    </div>
                                    <div className="single-input">
                                    <label htmlFor="order-id">Billing email</label>
                                    <input type="text" placeholder="Email You use during checkout" />
                                    </div>
                                    <button className="rts-btn btn-primary">Track</button>
                                </form>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabIndex={0}>
                                <div className="shipping-address-billing-address-account">
                                    <div className="half">
                                        <h2 className="title">Địa chỉ của tôi</h2>
                                        
                                    </div>
                               
                                </div>
                            </div>

                            {/* tài khoản của tôi */}
                            <div className="tab-pane fade" id="v-pills-settingsa" role="tabpanel" aria-labelledby="v-pills-settingsa-tab" tabIndex={0}>
                                <h2 className="title">Thông tin chi tiết</h2>                                
                                <Form
                                    form={formAcc}
                                    className="registration-form"                                
                                    layout="vertical"                                    
                                >
                                    <Divider/>
                                    <Row gutter={[20,2]}>                                        
                                        <Form.Item name="_idAcc" hidden><Input hidden /></Form.Item>
                                        <Col span={24} md={24} sm={24} xs={24}>
                                            <Form.Item name="_idAcc" style={{textAlign: "center"}}>
                                                <Avatar size={150} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${imageUrl}`} /> 
                                                <p className="mt-4" style={{ color: '#ff6600', marginRight: '8px', fontSize: "30px"}}>                                                    
                                                    {renderMemberRank(dataAcc?.hangTV)}
                                                </p>
                                            </Form.Item>
                                        </Col>
                                        <Row gutter={[16, 16]} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '15px', textAlign:'center', width: '100%',  }}>
                                            <Col span={12} md={12} sm={24} xs={24}>
                                                <Text strong style={{fontSize: '20px'}}><FaUser /> &nbsp;Họ và tên:</Text>
                                                <Text style={{ display: 'block', color: 'navy', fontSize: '20px' }}>{ dataAcc?.fullName || "Chưa cập nhật"}</Text>
                                            </Col>

                                            <Col span={12} md={12} sm={24} xs={24}>
                                                <Text strong style={{fontSize: '20px'}}><MdEmail /> &nbsp;Email:</Text>
                                                <Text style={{ display: 'block', color: 'navy', fontSize: '20px' }}>{ dataAcc?.email || "Chưa cập nhật"}</Text>
                                            </Col>

                                            <Col span={12} md={12} sm={24} xs={24}>
                                                <Text strong style={{fontSize: '20px'}}><FaPhone /> &nbsp;Số điện thoại:</Text>
                                                <Text style={{ display: 'block', color: 'navy', fontSize: '20px' }}>{ dataAcc?.phone || "Chưa cập nhật"}</Text>
                                            </Col>

                                            <Col span={12} md={12} sm={24} xs={24}>
                                                <Text strong style={{fontSize: '20px'}}><FaAddressCard /> &nbsp;Địa chỉ:</Text>
                                                <Text style={{ display: 'block', color: 'navy', fontSize: '20px' }}>{ dataAcc?.address || "Chưa cập nhật"}</Text>
                                            </Col>

                                            <Col span={12} md={12} sm={24} xs={24}>
                                                <Text strong style={{fontSize: '20px'}}><MdOutlineProductionQuantityLimits /> &nbsp;Tổng đơn hàng hoàn tất:</Text>
                                                <Text style={{ display: 'block', color: 'red', fontSize: '20px' }}>{ soLuongDonThanhCong || 0} đơn hàng</Text>
                                            </Col>

                                            <Col span={12} md={12} sm={24} xs={24}>
                                                <Text strong style={{fontSize: '20px'}}><FaCartPlus /> &nbsp;Tổng tiền tích luỹ:</Text>
                                                <Text style={{ display: 'block', color: 'red', fontSize: '20px' }}>{ tongDoanhThuThanhCong.toLocaleString("vi-VN") || 0}đ</Text>
                                            </Col>
                                        </Row>                                        

                                    </Row>                                    
                                </Form>                                
                            </div>

                            {/* đổi mật khẩu */}
                            <div className="tab-pane fade" id="v-pills-settingdoimatkhau" role="tabpanel" aria-labelledby="v-pills-settingsa-tab" tabIndex={0}>
                                <h2 className="title">Đổi Thông Tin Chi Tiết</h2>                                
                                <Form
                                    form={formAcc}
                                    className="registration-form"                                
                                    layout="vertical"                                    
                                    onFinish={handleDoiTT} 
                                >
                                    <Divider/>
                                    <Row gutter={[20,2]}>
                                        {/* <Col span={4} md={4} sm={24} xs={24}>
                                            <span style={{fontSize: "20px"}}>Ảnh đại diện: </span>
                                            <Avatar style={{marginTop: "5px", marginBottom: "10px"}} size={100} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataAcc?.image}`} />
                                        </Col> */}
                                        <Form.Item name="_idAcc" hidden><Input hidden /></Form.Item>
                                            <Col span={24} md={24} sm={24} xs={24}>
                                            <Form.Item
                                                label="Upload Ảnh đại diện"
                                                name="image"                                                
                                                hasFeedback
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập Upload Ảnh đại diện',
                                                    },                                                   
                                                ]}
                                            >
                                                <Upload
                                                    name="file"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    maxCount={1}
                                                    multiple={false}
                                                    customRequest={handleUploadFileImage}
                                                    beforeUpload={beforeUpload}
                                                    onChange={handleChange}
                                                    onRemove={handleRemoveFile}
                                                    fileList={fileList} // Gán danh sách file
                                                    onPreview={handlePreview}
                                                >
                                                    <div>
                                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                        <div style={{ marginTop: 8 }}>Upload</div>
                                                    </div>
                                                </Upload>

                                                <Modal
                                                    visible={isModalVisible}
                                                    footer={null}
                                                    title="Xem Hình Ảnh"
                                                    onCancel={() => setIsModalVisible(false)}
                                                >
                                                    <img alt="Uploaded" style={{ width: '100%' }} src={imageUrl} />
                                                </Modal>
                                            </Form.Item> 
                                        </Col>
                                        <Col span={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                labelCol={{span: 24}}
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                                    },
                                                    {
                                                        required: false,
                                                        pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                                        message: 'Không được nhập số!',
                                                    },
                                                ]}
                                                hasFeedback
                                            >
                                                <Input placeholder="Nhập họ và tên của bạn" />
                                            </Form.Item> 
                                        </Col>
                                        <Col span={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                label="Email"                                        
                                                name="email"                                                
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                                    },
                                                    {
                                                        type: "email",
                                                        message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                                    },

                                                ]}
                                                hasFeedback
                                            ><Input disabled placeholder="Nhập email của bạn" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                label="Số Điện Thoại"
                                                name="phone"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                                    },
                                                    {
                                                        pattern: /^0\d{9}$/,
                                                        message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                                    },
                                                ]}
                                                hasFeedback
                                            >
                                                <Input placeholder='Ví dụ: 0972138493' />
                                            </Form.Item> 
                                        </Col>
                                        <Col span={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                label="Địa chỉ"
                                                name="address"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                                    },                                                    
                                                ]}
                                                hasFeedback
                                            >
                                                <Input placeholder='Nhập địa chỉ...' />
                                            </Form.Item> 
                                        </Col>
                                        <Col span={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                label="Mật khẩu cũ"
                                                name="password"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                                    },                                                    
                                                ]}
                                                hasFeedback
                                            >
                                                <Input.Password placeholder='Nhập mật khẩu cũ' />
                                            </Form.Item> 
                                        </Col>
                                        <Col span={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                label="Mật khẩu mới"
                                                name="passwordMoi"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                                    },                                                    
                                                ]}
                                                hasFeedback
                                            >
                                                <Input.Password placeholder='Nhập mật khẩu muốn đổi mới' />
                                            </Form.Item> 
                                        </Col>

                                        <Col span={6} style={{margin: "auto"}}>
                                            <Button onClick={() => formAcc.submit()} type="primary" size="large" icon={<FaSave size={25} />}>Đổi thông tin</Button>
                                        </Col>

                                    </Row>                                    
                                </Form>                                
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>


        </>
    )
}
export default Account
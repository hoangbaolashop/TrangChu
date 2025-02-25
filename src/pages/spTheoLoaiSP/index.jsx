import { useLocation, useNavigate } from 'react-router-dom'
import './css.scss'
import { Button, Checkbox, Col, Form, InputNumber, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import BodyProduct from '../../components/BodyProduct/BodyProduct'
import { FiSearch } from 'react-icons/fi'
import { GrPowerReset } from 'react-icons/gr'
import { fetchAllProduct, fetchAllProductToCategoryLienQuan } from '../../services/productAPI'
import { fetchListHangSX } from '../../redux/HangSX/hangSXSlice'
import { fetchListCategory } from '../../redux/TheLoai/theLoaiSlice'
import { fetchOneTheLoai } from '../../services/loaiSPAPI'

const ProductToCategory = () => {

    const navigate = useNavigate()
    const [formLocGia] = Form.useForm()
    const dispatch = useDispatch()
    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    const dataHangSX = useSelector(state => state.hangSX.listHangSXs.data)

    const [dataListSP, setDataListSP] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(15)
    const [total, setTotal] = useState(0)

    const [dataLoaiSP, setDataLoaiSP] = useState([])

    const [tuSelected, setTuSelected] = useState('');
    const [denSelected, setDenSelected] = useState('');
    const [hangSXSelected, setHangSXSelected] = useState([]);
    const [selectedHangSXs, setSelectedHangSXs] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let tenSearch = queryParams.get('TenSP')
    let idLoaiSP = queryParams.get('IdLoaiSP')
    console.log("tensp all pro: ", tenSearch);
    console.log("idLoaiSP: ", idLoaiSP);

    const fetchOneLSP = async () => {
        let query = ''

        // Kiểm tra nếu idLoaiSP là mảng hoặc một giá trị đơn
        const idLoaiSPArray = Array.isArray(idLoaiSP) ? idLoaiSP : [idLoaiSP];  // Nếu không phải mảng, chuyển thành mảng
  
        if (idLoaiSPArray.length > 0) {
          query += `IdLoaiSP=${idLoaiSPArray.join(',')}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
        }  

        const res = await fetchOneTheLoai(query)
        if (res && res.data) {
            setDataLoaiSP(res.data)
        }
    }

    const fetchListSP = async () => {
        let query = `page=${current}&limit=${pageSize}`     
  
        if (tenSearch) {
          query += `&TenSP=${encodeURIComponent(tenSearch)}`;
        }  
        // Nếu selectedLoaiSP là mảng, chuyển nó thành chuỗi query
        if (tuSelected) {
            query += `&tu=${tuSelected}`;
        }
        if (denSelected) {
            query += `&den=${denSelected}`;
        }              
        if (hangSXSelected && hangSXSelected.length > 0) {
            query += `&locTheoHangSX=${encodeURIComponent(JSON.stringify(hangSXSelected))}`;
        }   
        // Kiểm tra nếu idLoaiSP là mảng hoặc một giá trị đơn
        const idLoaiSPArray = Array.isArray(idLoaiSP) ? idLoaiSP : [idLoaiSP];  // Nếu không phải mảng, chuyển thành mảng
  
        if (idLoaiSPArray.length > 0) {
          query += `&IdLoaiSP=${idLoaiSPArray.join(',')}`;  // Chuyển mảng thành chuỗi cách nhau bằng dấu phẩy
        }     
    
        const res = await fetchAllProductToCategoryLienQuan(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataListSP(res.data)
            setTotal(res.totalSanPham)
        }
    }

    useEffect(() => {
        if (tuSelected !== '' && denSelected !== '') {
            fetchListSP(); // Gọi lại hàm fetch khi selectedLoaiSP thay đổi
        } else {
            fetchListSP(); // Nếu không có thể loại nào được chọn, fill lại giá trị bandđầu
        }
    }, [tuSelected, denSelected]); // Lắng nghe sự thay đổi của selectedLoaiSP

    useEffect(() => {
        if (hangSXSelected && hangSXSelected.length > 0) {
            fetchListSP(); 
        } else {
            fetchListSP(); 
        }
    }, [hangSXSelected]); 

    useEffect(() => {
        fetchListSP()
    }, [tenSearch, current, pageSize, idLoaiSP])

    useEffect(() => {
        fetchOneLSP()
    }, [idLoaiSP])

    useEffect(() => {
        dispatch(fetchListHangSX())
        dispatch(fetchListCategory())
    }, [dispatch])

    const plainOptionThuongHieu = dataHangSX?.map((item, index) => ({
        label: item.TenHangSX,
        value: item._id
    }))

    const onFinishLocGia = (values) => {
        console.log('onFinishLocGia:', values);

        setTuSelected(values.tu)
        setDenSelected(values.den)
    };   
    
    const onChangeHangSX = (values) => {
        console.log('id HangSX:', values);
        setHangSXSelected(values)
        setSelectedHangSXs(values)
    };

    const cancelSelected = () => {
        formLocGia.resetFields()
        setTuSelected('')
        setDenSelected('')

        setHangSXSelected([])
        setSelectedHangSXs([])
    };


    return (
        <>
            {/* rts navigation bar area start */}
            <div className="rts-navigation-area-breadcrumb">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                        <a onClick={() => navigate('/')}>Home</a>
                        <i className="fa-regular fa-chevron-right" />
                        <a className="current" >{dataLoaiSP?.TenLoaiSP}</a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* rts navigation bar area end */}
            <div className="section-seperator">
                <div className="container">
                    <hr className="section-seperator" />
                </div>
            </div>

            {/* shop[ grid sidebar wrapper */}
            <div className="shop-grid-sidebar-area rts-section-gap">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-xl-3 col-lg-12 pr--70 pr_lg--10 pr_sm--10 pr_md--5 rts-sticky-column-item">
                            <div className="sidebar-filter-main theiaStickySidebar">
                            <div className="single-filter-box">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <h5 className="title">
                                        Lọc sản phẩm theo giá
                                        <Button 
                                        onClick={cancelSelected}
                                        style={{ cursor: "pointer", position: "relative", right: "-35px", color: "orange", border: "none"}} 
                                        icon={<GrPowerReset size={20} />}/>
                                    </h5>                                    
                                </div>
                                <div className="filterbox-body">
                                <Form
                                    form={formLocGia}
                                    onFinish={onFinishLocGia}       
                                    layout={"vertical"}                             
                                >
                                    <Row gutter={[20,2]}>
                                        <Col span={12}>
                                            <Form.Item
                                            label="Từ giá"
                                            name="tu"                                    
                                            >
                                                <InputNumber
                                                    name="from"
                                                    min={0}
                                                    placeholder="đ TỪ"
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    formatter={value => 
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                            label="Đến giá"
                                            name="den"                                    
                                            >
                                                <InputNumber
                                                    name="from"
                                                    min={0}
                                                    placeholder="đ ĐẾN"
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    formatter={value => 
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>                                        
                                    </Row>
                                    <Row>
                                        <Col span={24} style={{textAlign: "center"}}>
                                            <Button onClick={() => formLocGia.submit()} icon={<FiSearch />}
                                            style={{textAlign: "center", width: "120px" }} type='primary'>Áp dụng</Button>
                                        </Col>
                                    </Row>
                                </Form>                                
                                </div>
                            </div>

                            <div className="single-filter-box">
                                <h5 className="title">Lọc theo thuơng hiệu</h5>
                                <div className="filterbox-body">
                                    <div className="category-wrapper ">
                                        <Checkbox.Group onChange={onChangeHangSX} value={selectedHangSXs}>
                                            <Row>
                                                {plainOptionThuongHieu.map((item, index) => (
                                                <Col span={24} key={`index-${index}`} style={{padding: "7px 0"}}>
                                                    <Checkbox value={item.value} >
                                                        {item.label}
                                                    </Checkbox>
                                                </Col>
                                                ))}
                                            </Row>
                                        </Checkbox.Group>
                                    </div>
                                </div>
                            </div>
                                                      
                            </div>
                        </div>
                        
                        <BodyProduct
                        dataListSP={dataListSP}
                        setDataListSP={setDataListSP}
                        current={current}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                        total={total}
                        setTotal={setTotal}
                        />
                    </div>
                </div>
            </div>
            {/* shop[ grid sidebar wrapper end */}
        </>
    )
}
export default ProductToCategory
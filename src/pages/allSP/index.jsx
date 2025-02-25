import { useLocation, useNavigate } from 'react-router-dom'
import './css.scss'
import BodyProduct from '../../components/BodyProduct/BodyProduct'
import { Button, Checkbox, Col, Form, InputNumber, Row } from 'antd'
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchListHangSX } from '../../redux/HangSX/hangSXSlice';
import { fetchListCategory } from '../../redux/TheLoai/theLoaiSlice';
import { fetchAllProduct } from '../../services/productAPI';
import { GrPowerReset } from "react-icons/gr";

const AllProduct = () => {

    const navigate = useNavigate()
    const [formLocGia] = Form.useForm()
    const dispatch = useDispatch()
    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    const dataHangSX = useSelector(state => state.hangSX.listHangSXs.data)

    const [dataListSP, setDataListSP] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(15)
    const [total, setTotal] = useState(0)

    const [tuSelected, setTuSelected] = useState('');
    const [denSelected, setDenSelected] = useState('');
    const [categorySelected, setCategorySelected] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [hangSXSelected, setHangSXSelected] = useState([]);
    const [selectedHangSXs, setSelectedHangSXs] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let tenSearch = queryParams.get('TenSP')
    console.log("tensp all pro: ", tenSearch);
    

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
        // Nếu selectedLoaiSP là mảng, chuyển nó thành chuỗi query
        if (categorySelected && categorySelected.length > 0) {
            query += `&locTheoLoai=${encodeURIComponent(JSON.stringify(categorySelected))}`;
        }       
        if (hangSXSelected && hangSXSelected.length > 0) {
            query += `&locTheoHangSX=${encodeURIComponent(JSON.stringify(hangSXSelected))}`;
        }
        // if (sortQuery) {
        //     query += `&${sortQuery}`;
        // } 
        // // Thêm tham số order nếu có
        // if (orderQuery) {
        //     query += `&${orderQuery}`;
        // }
    
        const res = await fetchAllProduct(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataListSP(res.data)
            setTotal(res.totalSanPham)
        }
    }
    console.log("all sp: ", dataListSP);
    
    useEffect(() => {
        if (tuSelected !== '' && denSelected !== '') {
            fetchListSP(); // Gọi lại hàm fetch khi selectedLoaiSP thay đổi
        } else {
            fetchListSP(); // Nếu không có thể loại nào được chọn, fill lại giá trị bandđầu
        }
    }, [tuSelected, denSelected]); // Lắng nghe sự thay đổi của selectedLoaiSP

    useEffect(() => {
        if (categorySelected && categorySelected.length > 0) {
            fetchListSP(); 
        } else {
            fetchListSP(); 
        }
    }, [categorySelected]); 

    useEffect(() => {
        if (hangSXSelected && hangSXSelected.length > 0) {
            fetchListSP(); 
        } else {
            fetchListSP(); 
        }
    }, [hangSXSelected]); 


    useEffect(() => {
        fetchListSP()
    }, [tenSearch, current, pageSize])

    useEffect(() => {
        dispatch(fetchListHangSX())
        dispatch(fetchListCategory())
    }, [dispatch])


    const plainOptions = dataTheLoai?.map((item, index) => ({
        label: item.TenLoaiSP,
        value: item._id
    }))

    const plainOptionThuongHieu = dataHangSX?.map((item, index) => ({
        label: item.TenHangSX,
        value: item._id
    }))

    const onFinishLocGia = (values) => {
        console.log('onFinishLocGia:', values);

        setTuSelected(values.tu)
        setDenSelected(values.den)
    };    

    const onChangeCategory = (values) => {
        console.log('id category:', values);
        setCategorySelected(values)
        setSelectedCategories(values)
    };    

    const onChangeHangSX = (values) => {
        console.log('id HangSX:', values);
        setHangSXSelected(values)
        setSelectedHangSXs(values)
    };
    console.log(' HangSX:', hangSXSelected);

    const cancelSelected = () => {
        formLocGia.resetFields()
        setTuSelected('')
        setDenSelected('')

        setCategorySelected([])
        setSelectedCategories([])

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
                        <a className="current" >Trang sản phẩm</a>
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
                                <h5 className="title">
                                    Lọc theo loại sản phẩm                                   
                                </h5>
                                <div className="filterbox-body">
                                    <div className="category-wrapper ">
                                        <Checkbox.Group onChange={onChangeCategory} value={selectedCategories}>
                                            <Row>
                                                {plainOptions.map((item, index) => (
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
export default AllProduct
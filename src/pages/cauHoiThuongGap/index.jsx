import { Col, Form, Input, message, Pagination, Row } from 'antd'
import { createCauHoi, fetchAllCauHoi } from '../../services/cauHoiAPI'
import { useEffect, useState } from 'react'
const CauHoiThuongGap = () => {

    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [dataCauHoi, setDataCauHoi] = useState([])
    const [totalCauHoi, setTotalCauHoi] = useState(0);
    const [currentCauHoi, setCurrentCauHoi] = useState(1)
    const [pageSizeCauHoi, setPageSizeCauHoi] = useState(5)

    const fetchTatCaCauHoi = async () => {
        let query = `page=${currentCauHoi}&limit=${pageSizeCauHoi}`
        const res = await fetchAllCauHoi(query)
        console.log("res cauhoi:", res);
        
        if(res && res.data) {
            setDataCauHoi(res.data)
            setTotalCauHoi(res.totalCauHoi)
        }
    }

    const onChangePagination = (page, pageSize) => {
        setCurrentCauHoi(page);
        setPageSizeCauHoi(pageSize); // Cập nhật pageSize nếu cần
    };
    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== currentCauHoi) {
            setCurrentCauHoi(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSizeCauHoi) {
            setPageSizeCauHoi(pagination.pageSize)
            setCurrentCauHoi(1);
        }

        // Cuộn về đầu trang
        window.scrollTo({ top: 230, behavior: 'smooth' });
    }

    const submitCauHoi = async (values) => {
        const {
            fullName, email, cauHoi
        } = values

        console.log("fullName, email, cauHoi: ",fullName, email, cauHoi);
        setLoading(true)
        let res = await createCauHoi(fullName, email, cauHoi)
        if(res && res.data) {
            message.success(res.message)
            form.resetFields()
            await fetchTatCaCauHoi()
        }
        setLoading(false)        
    }

    useEffect(() => {
        fetchTatCaCauHoi()
    },[currentCauHoi, pageSizeCauHoi])

  return (
    <div>
        <div className="rts-navigation-area-breadcrumb bg_light-1">
            <div className="container">
                <div className="row">
                <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                    <a href='/'>Home</a>
                    <i className="fa-regular fa-chevron-right" />
                    <a className="#">Câu Hỏi Thường Gặp</a>
                    <i className="fa-regular fa-chevron-right" />
                    </div>
                </div>
                </div>
            </div>
        </div>      

        <div className="rts-faq-area-start rts-section-gap">
            <div className="container">
                <div className="row g-5">
                <div className="col-lg-4">
                    <div className="faq-content-left-main-wrapper">
                        <h3 className="title" style={{textAlign: "center", color: "navy"}}>Bạn có thể đặt câu hỏi ở đây.</h3>
                        <Row>
                            <Col span={24} md={24} xs={24} sm={24} lg={24}>
                                <Form
                                // className="contact-form-1"
                                form={form}
                                layout="vertical"
                                onFinish={submitCauHoi}   
                                >
                                    <Row>
                                        <Col span={24} md={24} xs={24} sm={24} lg={24}>
                                            <div className="single">
                                                <Form.Item
                                                    label="Họ và Tên"
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
                                                    <Input style={{fontSize: "16px"}} placeholder="Nhập họ và tên của bạn" />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col span={24} md={24} xs={24} sm={24} lg={24}>
                                            <div className="single">
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
                                                ><Input style={{fontSize: "16px"}} placeholder="Nhập email của bạn" />
                                                </Form.Item>
                                            </div>                                        
                                        </Col>
                                        <Col span={24} md={24} xs={24} sm={24} lg={24}>
                                            <div className="single">
                                                <Form.Item
                                                    label="Nhập câu hỏi?"
                                                    name="cauHoi"
                                                    rules={[{ required: true, message: 'Nhập câu hỏi?' }]}
                                                >
                                                <   Input.TextArea style={{fontSize: "16px"}} rows={4} placeholder="Nhập câu hỏi?" />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col span={24} md={24} xs={24} sm={24} lg={24}>
                                            <button type='button' loading={loading} onClick={() => form.submit()} className="rts-btn btn-primary mt--20" style={{fontSize: "20px"}}>Gửi câu hỏi?</button>
                                        </Col>
                                    </Row>   
                                </Form>                            
                            </Col>    
                        </Row>              
                    </div>
                </div>
                <div className="col-lg-7 offset-lg-1">
                    <div className="accordion-main-area-wrapper-style-1">
                    <div className="accordion" id="accordionExample">
                        <h3 className="title" style={{textAlign: "center", color: "navy"}}>Dưới đây là các câu trả lời</h3>
                        {dataCauHoi?.length > 0 ? dataCauHoi?.map((item, index) => {
                            return (
                                <>
                                <div key={item?._id} className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button" type="button" data-bs-toggle='collapse' data-bs-target={`#collapseOne${item?._id}`} aria-expanded="true" aria-controls={`collapseOne${item?._id}`}>
                                        {item?.cauHoi}?
                                        </button>
                                    </h2>
                                    <div id={`collapseOne${item?._id}`} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                        {item?.cauTraLoi ? <div style={{color: "brown"}} className="truncate"  dangerouslySetInnerHTML={{ __html: item?.cauTraLoi }} /> : <span style={{color: "gray"}}>⚠ chưa có câu trả lời</span> }
                                        </div>
                                    </div>
                                </div>
                                </>
                            )
                        }) : 'chưa có câu hỏi và câu trả lời nào'}       
                        <br/>                 
                       <Pagination          
                        style={{justifyContent: "center"}}                               
                            responsive
                            current={currentCauHoi}
                            pageSize={pageSizeCauHoi}
                            total={totalCauHoi}
                            onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })} // Gọi hàm onChangePagination khi thay đổi trang
                            // onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} câu hỏi</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        /> 
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default CauHoiThuongGap
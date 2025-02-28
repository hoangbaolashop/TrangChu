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

        <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thuê Xe Máy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Thuê Xe Máy</h1>
        <nav>
            <ul>
                <li><a href="#">Trang chủ</a></li>
                <li><a href="#xe">Xe</a></li>
                <li><a href="#lienhe">Liên hệ</a></li>
            </ul>
        </nav>
    </header>

    <section id="xe" class="xe-container">
        <h2>Các loại xe</h2>
        <div class="xe-item">
            <img src="xe1.jpg" alt="Xe 1">
            <h3>Xe tay ga 1</h3>
            <p>Giá: 150.000 VND/ngày</p>
            <button class="thue-btn" data-tenxe="Xe tay ga 1" data-gia="150000">Thuê ngay</button>
        </div>
        <div class="xe-item">
             <img src="xe2.jpg" alt="Xe 2">
            <h3>Xe số 1</h3>
            <p>Giá: 100.000 VND/ngày</p>
            <button class="thue-btn" data-tenxe="Xe số 1" data-gia="100000">Thuê ngay</button>
        </div>
        <div class="xe-item">
            <img src="xe3.jpg" alt="Xe 3">
            <h3>Xe tay ga 2</h3>
            <p>Giá: 200.000 VND/ngày</p>
            <button class="thue-btn" data-tenxe="Xe tay ga 2" data-gia="200000">Thuê ngay</button>
        </div>
        </section>

    <section id="lienhe" class="lienhe-container">
        <h2>Liên hệ</h2>
        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, Thành phố HCM</p>
        <p>Điện thoại: 0123456789</p>
        <p>Email: info@thuexemay.com</p>
    </section>

    <footer>
        <p>&copy; 2023 Thuê Xe Máy</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
                        
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
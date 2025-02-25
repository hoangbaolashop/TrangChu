import { BiSolidDiscount } from 'react-icons/bi'
import imgVoucher from '../../assets/images/869649.png'
import { fetchAllVoucher } from '../../services/voucherAPI'
import { useEffect, useState } from 'react'
import LuckyWheel from '../detail/LuckyWheel'

const QuaySoTrungThuong = () => {

    const [dataVoucher, setDataVoucher] = useState([])

    const fetchTatCaVoucher = async () => {
        let query = 'page=1&limit=1000'
        let res = await fetchAllVoucher(query)
        if(res && res.data){
            setDataVoucher(res.data)
        }
    }

    useEffect(() => {
        fetchTatCaVoucher()
    }, [])

  return (
    <div>        
        <div className="rts-navigation-area-breadcrumb bg_light-1">
            <div className="container">
                <div className="row">
                <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                    <a href='/'>Home</a>
                    <i className="fa-regular fa-chevron-right" />
                    <a className="#">Quay số trúng thưởng</a>
                    <i className="fa-regular fa-chevron-right" />
                    </div>
                </div>
                </div>
            </div>
        </div>       
        {/* about area start */}
        <div className="rts-about-area rts-section-gap2" style={{backgroundColor: "#f9f9f9",}}>
        <div className="container-3">
            <div className="row align-items-center">
            <div className="col-lg-4">
                <div className="thumbnail-left">
                {/* <img src={imgVoucher} alt="" /> */}
                <img style={{borderRadius: "10%"}} src="https://cdn.hoanghamobile.com/Uploads/2024/12/17/vong-xoay-can-giua.gif;trim.threshold=0;trim.percentpadding=0;width=480;" alt="" />
                </div>
            </div>
            <div className="col-lg-8 pl--60 pl_md--10 pt_md--30 pl_sm--10 pt_sm--30">
                <div className="about-content-area-1">
                <h2 className="title">
                    VÒNG QUAY MAY MẮN
                </h2>
                {/* <p className="disc">
                    Venenatis augue consequat class magnis sed purus, euismod ligula nibh congue quis vestibulum nostra, cubilia varius velit vitae rhoncus. Turpis malesuada fringilla urna dui est torquent aliquet, mi nec fermentum placerat nisi venenatis sapien, mattis nunc nullam rutrum feugiat porta. Pharetra mi nisl consequat semper quam litora aenean eros conubia molestie erat, et cursus integer rutrum sollicitudin auctor curae inceptos senectus sagittis est,
                </p> */}
                <div className="check-main-wrapper" style={{display: "flex", justifyContent: "center"}}>                    
                    <LuckyWheel />
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        {/* about area end */}

        {/* meet our expart team */}
        <div className="meet-our-expart-team rts-section-gap2">
        <div className="container-3">
            <div className="row">
            <div className="col-lg-12">
                <div className="title-center-area-main">
                <h2 className="title">
                    Quà tặng của chúng tôi
                </h2>
                <p className="disc">
                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium mollis ex, vel interdum augue faucibus sit amet. Proin tempor purus ac suscipit... */}
                </p>
                </div>
            </div>
            </div>
            <div className="row g-5 mt--40">
                {dataVoucher?.map((voucher, index) => { 
                    return (            
                    <div className="col-lg-3 col-md-6 col-sm-12 col-12" style={{boxShadow: '0 0 5px 0 rgba(70, 70, 70, 0.5)', borderRadius: "10px", marginLeft: "80px", padding: "20px", marginBottom: "20px"}} >
                        {/* single team area start */}
                        <div className="single-team-style-one">
                        <a className="thumbnail">
                            <img src={imgVoucher} alt="team_single" />
                        </a>
                        <div className="bottom-content-area">
                            <div className="top">
                            <h3 className="title">
                            {voucher.code}
                            </h3>
                            <span className="designation" style={{fontSize: "16px", color: "blueviolet"}}>Điều kiện: Giá trị đơn hàng trên {parseInt(voucher.dieuKien).toLocaleString()}đ</span>
                            </div>
                            <div className="bottom" style={{color: "red"}}>
                                <a href="#" className="number" style={{color: "red"}}>
                                    <BiSolidDiscount />
                                    Được giảm:  {voucher.giamGia}%
                                </a>                                
                            </div>
                        </div>
                        </div>
                        {/* single team area end */}
                    </div>
                )})}           
            </div>
        </div>
        </div>
        {/* meet our expart end */}


    </div>
  )
}
export default QuaySoTrungThuong
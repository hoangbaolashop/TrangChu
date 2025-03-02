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
                </div>
            </div>
            <div className="col-lg-8 pl--60 pl_md--10 pt_md--30 pl_sm--10 pt_sm--30">
                <div className="about-content-area-1">
                <h2 className="title">
                    ---- VÒNG QUAY MAY MẮN TIGARBOARDGAME
                </h2>
               <p> <h4 className="title">
                    Voucher giảm giá, minigame, xúc xắc, bọc bài 
                </h4></p>
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
                
               
                </div>
            </div>
            </div>
            <div className="row g-5 mt--40">
                {dataVoucher?.map((voucher, index) => { 
                    return (            
                    <div className="col-lg-3 col-md-6 col-sm-12 col-12" style={{boxShadow: '0 0 5px 0 rgba(70, 70, 70, 0.5)', borderRadius: "10px", marginLeft: "80px", padding: "20px", marginBottom: "20px"}} >
                        {/* single team area start */}
                    
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
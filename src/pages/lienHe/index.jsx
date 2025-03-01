import { Divider } from "antd"
import { useEffect, useState } from "react"
import { getOneLienHe } from "../../services/thueGameLienHeAPI"

const LienHe = () => {
   
    const [dataLienHe, setDataLienHe] = useState(null)    

    const fetchOneLienHes = async () => {
        const res = await getOneLienHe()
        if(res && res.data) {
            setDataLienHe(res.data)
        }
    }

    useEffect(() => {
        fetchOneLienHes()
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
                        <a className="#">Liên hệ</a>                    
                    </div>
                </div>
                </div>
            </div>
        </div>      
        <div className="rts-faq-area-start ">
            <div className="container">
                <div className="row g-6">
                    <div className="bg_gradient-tranding-items p-5">
                    <div  dangerouslySetInnerHTML={{ __html: dataLienHe?.text }} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default LienHe
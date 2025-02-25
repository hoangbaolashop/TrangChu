import payment02 from "../../assets/images/payment/02.png"
import payment03 from "../../assets/images/payment/03.png"
import payment06 from "../../assets/images/payment/06.png"
import SearchMobile from "../Search/SearchMobile"


const Footer = () => {
      return (
        <>
        <SearchMobile/>
          <div className="rts-footer-area pt--80 bg_blue-footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer-main-content-wrapper pb--70">
                  {/* single footer area wrapper */}
                  <div className="single-footer-wized">
                    <h3 className="footer-title">Giới thiệu về Tigar</h3>
                    <div className="call-area">
                      <div className="icon">
                        <i className="fa-solid fa-phone-rotary" />
                      </div>
                      <div className="info">
                        <span>Có thắc mắc? Gọi cho chúng tôi 24/7</span>
                        <a href="#" className="number">+(84) 564 942 086</a>
                      </div>
                    </div>
                    <div className="opening-hour">
                      <div className="single">
                        <p>Thứ Hai - Thứ Sáu: <span>8:00 sáng - 6:00 chiều</span></p>
                      </div>
                      <div className="single">
                        <p>Thứ Bảy: <span>8:00 sáng - 6:00 chiều</span></p>
                      </div>
                      <div className="single">
                        <p>Chủ Nhật: <span>Đóng cửa dịch vụ</span></p>
                      </div>
                    </div>
                  </div>
                  {/* single footer area wrapper */}
                  {/* single footer area wrapper */}
                  <div className="single-footer-wized">
                    <h3 className="footer-title">Cửa hàng của chúng tôi</h3>
                    <div className="footer-nav">
                      <ul>
                        <li><a href="/">Trang chủ</a></li>                       
                        <li><a href="/wishlist">Danh sách yêu thích</a></li>                       
                      </ul>
                    </div>
                  </div>
                  {/* single footer area wrapper */}
                  {/* single footer area wrapper */}
                  <div className="single-footer-wized">
                    <h3 className="footer-title">Danh mục cửa hàng</h3>
                    <div className="footer-nav">
                      <ul>
                        <li><a href="/all-product">Sản Phẩm</a></li>
                        <li><a href="/quayso">Quay số trúng thưởng</a></li>                       
                      </ul>
                    </div>
                  </div>
                  {/* single footer area wrapper */}
                  {/* single footer area wrapper */}
                  <div className="single-footer-wized">
                    <h3 className="footer-title">Liên kết hữu ích</h3>
                    <div className="footer-nav">
                      <ul>                       
                        <li><a href="/cauhoithuonggap">Câu hỏi thường gặp</a></li>
                      </ul>
                    </div>
                  </div>
                  {/* single footer area wrapper */}
                  {/* single footer area wrapper */}
                  <div className="single-footer-wized">
                    <h3 className="footer-title">Bản tin của chúng tôi</h3>
                    <p className="disc-news-letter">
                    Đăng ký vào danh sách gửi thư để nhận thông tin cập nhật về <br/>
                    sản phẩm mới và các chương trình giảm giá khác
                    </p>
                    <form className="footersubscribe-form" action="#">
                      <input type="email" placeholder="Your email address" required />
                      <button className="rts-btn btn-primary">Đăng ký</button>
                    </form>
                    <p className="dsic">
                    Tôi muốn nhận tin tức và ưu đãi đặc biệt
                    </p>
                  </div>
                  {/* single footer area wrapper */}
                </div>
                <div className="social-and-payment-area-wrapper">
                  <div className="social-one-wrapper">
                    <span>Theo dõi chúng tôi:</span>
                    <ul>
                      <li><a href="#"><i className="fa-brands fa-facebook-f" /></a></li>
                      <li><a href="#"><i className="fa-brands fa-twitter" /></a></li>
                      <li><a href="#"><i className="fa-brands fa-youtube" /></a></li>
                      <li><a href="#"><i className="fa-brands fa-whatsapp" /></a></li>
                      <li><a href="#"><i className="fa-brands fa-instagram" /></a></li>
                    </ul>
                  </div>
                  <div className="payment-access">
                    <span>Chấp nhận thanh toán:</span>
                    <img src={payment06} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="rts-copyright-area five-h">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="copyright-between-1">
                    <p className="disc">
                    Bản quyền 2024 <a href="https://www.tigarboardgame.com/" target="_blank">©tigarboardgame</a>. Bảo lưu mọi quyền.
                    </p>
                    {/* <a href="#" className="playstore-app-area">
                      <span>Tải ứng dụng</span>
                      <img src={payment02} alt="" />
                      <img src={payment03} alt="" />
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </>
      )
}
export default Footer
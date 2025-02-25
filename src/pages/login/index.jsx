import { Button, Checkbox, Col, Divider, Form, Input, message, Modal, notification, Row } from 'antd'
import logoKT from '../../assets/images/logo-kt.png'
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import icongoogle from '../../assets/images/form/google.svg'
import iconfb from '../../assets/images/form/facebook.svg'
import { checkTrangThaiIsActive, handleLogin, handleQuenPassword } from '../../services/loginKHAPI';
import { doLoginAction } from '../../redux/accKH/accountSlice';
import { doLoginActionCart } from '../../redux/order/orderSlice';
import { doLoginActionWishlist } from '../../redux/wishlist/wishlistSlice';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {

    const [form] = Form.useForm()
    const [formLayMK] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingDoiMK, setIsLoadingDoiMK] = useState(false)
    const [remember, setRemember] = useState(false);
    const [openQuenMK, setOpenQuenMK] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.accountKH.isAuthenticated)
    console.log("isAuthenticated: ", isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        const rememberedKH = localStorage.getItem("rememberedKH");
        if (rememberedKH) {
            const account = JSON.parse(rememberedKH);
            console.log("JSON.parse(rememberedKH): ",JSON.parse(rememberedKH));
            
            form.setFieldsValue({
                email: account.email,
                password: account.password,
                remember: true,
            });
            setRemember(true);
        }
    }, [form]);

    const handleLayMK = async (values) => {
        const email_doimk = values.email; 
        console.log("email_doimk: ", email_doimk);  
    
        if (!email_doimk) {
            notification.error({ 
                message: "Lỗi", 
                description: "Vui lòng nhập email!"
            });
            return;
        }

        try {
            const res = await handleQuenPassword(email_doimk);
            console.log("res: ", res);
            
            if (res.data) {
                notification.success({
                    message: "Lấy lại mật khẩu thành công!",
                    description: res.message
                });                
            } else {
                notification.error({ 
                    message: "Lấy lại mật khẩu thất bại!",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5,
                });
            }
        } catch (error) {
            notification.error({ 
                message: "Lấy lại mật khẩu thất bại!",
                description: error.message,
            });
        } 
    };
    

    const onFinish = async (values) => {
        const {
            email, password
        } = values

        setIsLoading(true)
        const res = await handleLogin(email, password)

        if(res && res.data) {
            localStorage.setItem("access_token", res.access_token)
            dispatch(doLoginAction(res.data))
            const customerId = res.data._id
            dispatch(doLoginActionCart({ customerId }))
            dispatch(doLoginActionWishlist({ customerId }))
            message.success(res.message)

            if (remember) {
                // Nếu người dùng chọn "Ghi nhớ tài khoản", lưu thông tin vào localStorage
                localStorage.setItem("rememberedKH", JSON.stringify({ email, password }));
            } else {
                // Nếu không chọn, xóa dữ liệu đã lưu (nếu có)
                localStorage.removeItem("rememberedKH");
            }

            form.resetFields()
            // window.history.back();
            navigate('/');
        } else {
            notification.error({ 
                message: "Đăng nhập không thành công!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)
    }    

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Hàm để tạo mật khẩu ngẫu nhiên
    const generateRandomPassword = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    };

    return (
        <>
            <div className="rts-navigation-area-breadcrumb bg_light-1">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                        <a href="/">Home</a>
                            <i className="fa-regular fa-chevron-right" />
                        <a className="current">Đăng nhập</a>
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

            {/* rts register area start */}
            <div className="rts-register-area rts-section-gap bg_light-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="registration-wrapper-1">
                                <h3 className="title">Đăng nhập tài khoản của bạn</h3>
                                <Form
                                form={form}
                                className="registration-form"                                
                                layout="vertical"                                    
                                onFinish={onFinish} 
                                >
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
                                    ><Input placeholder="Nhập email của bạn" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Password không được để trống!',
                                            },  
                                            {
                                                required: false,
                                                pattern: new RegExp(/^(?!.*\s).{6,}$/),
                                                message: 'Không được nhập có dấu cách, tối thiểu có 6 kí tự!',
                                            },                                  
            
                                        ]}
                                        hasFeedback
                                        ><Input.Password onKeyDown={(e) => {
                                            console.log("check key: ", e.key);
                                            if(e.key === 'Enter') form.submit()
                                        }} placeholder="Nhập mật khẩu của bạn" />
                                    </Form.Item>  

                                    <Form.Item
                                        name="remember"
                                        valuePropName="checked"                                
                                    >
                                        <div style={{display: "flex", justifyContent: "space-between"}}>                                        
                                            <Checkbox
                                                checked={remember}
                                                onChange={(e) => setRemember(e.target.checked)}
                                            >Ghi nhớ tài khoản</Checkbox>

                                            <span style={{cursor: "pointer", fontWeight: "500"}} onClick={() => setOpenQuenMK(true)}>Quên mật khẩu</span>
                                        </div>
                                    </Form.Item>


                                    <Form.Item >                                       
                                        <Button loading={isLoading} 
                                                type="primary" 
                                                size='large'
                                                style={{border: "none", lineHeight: "10px"}}
                                                className="rts-btn btn-primary"
                                                onClick={() => form.submit()}>
                                            Đăng nhập 
                                        </Button>                                            
                                    </Form.Item>

                                    <div className="another-way-to-registration">
                                        {/* <div className="registradion-top-text">
                                            <span>&nbsp; HOẶC  &nbsp;</span>
                                        </div>
                                        <div className="login-with-brand">
                                            <a href="#" className="single">
                                                <img src={icongoogle} alt="login" />
                                            </a>                                            

                                            <a href="#" className="single">
                                                <img src={iconfb} alt="login" />
                                            </a>
                                        </div> */}
                                        <p>Chưa có tài khoản? <a onClick={() => navigate('/register-web')} style={{color: "green"}}>Bấm vào đây để đăng ký!</a></p>
                                    </div>
                                </Form>     

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts register area end */}
            <Modal 
            title="Lấy mật khẩu"
            centered 
            loading={isLoadingDoiMK}
            open={openQuenMK} 
            onOk={() => formLayMK.submit()}  
            okText={"Lấy mật khẩu"}
            cancelText="Huỷ"  
            width={500}                           
            onCancel={() => {
                setOpenQuenMK(false)
                formLayMK.resetFields()
            }}>
                <Divider/>
                <Form
                form={formLayMK}
                className="registration-form"                                
                layout="vertical"                                    
                onFinish={handleLayMK} 
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Nhập Email cần lấy mật khẩu"                                        
                                name="email"                                                
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập email chính xác để lấy lại mật khẩu!',
                                    },
                                    {
                                        type: "email",
                                        message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                    },

                                ]}
                                hasFeedback
                            ><Input placeholder="Email của bạn..." />
                            </Form.Item>                        
                        </Col>
                    </Row>
                </Form>
            </Modal>                           
        </>
    )
}
export default Login
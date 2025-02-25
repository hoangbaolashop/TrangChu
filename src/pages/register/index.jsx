import { Button, Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row } from 'antd'
import logoKT from '../../assets/images/logo-kt.png'
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import icongoogle from '../../assets/images/form/google.svg'
import iconfb from '../../assets/images/form/facebook.svg'
import { handleRegister, handleXacThucOTP } from '../../services/loginKHAPI';

const Register = () => {

    const [form] = Form.useForm()
    const [formOTP] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOTP, setIsLoadingOTP] = useState(false)
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.accountKH.isAuthenticated)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        formOTP.resetFields()
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const onFinish = async (values) => {
        const {
            email, password, phone, fullName
        } = values

        formOTP.setFieldsValue({ email: email });  // Cập nhật email vào form OTP

        console.log("email, password, phone, fullName: ", email, password, phone, fullName);
        
        setIsLoading(true)
        const res = await handleRegister(email, password, fullName, phone)
        if(res.success === true) {
            // message.success('Đăng ký tài khoản thành công! Bạn có thể đăng nhập!')
            message.success(res.message)
            // form.resetFields()
            showModal()
            // navigate("/login-web")
        } else {
            notification.error({ 
                message: "Đăng ký không thành công!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)
    }

    const handleXacThucTaiKhoanOTP = async (values) => {
        const {
            otp, email
        } = values

        console.log("otp, email: ", otp, email);
        
        setIsLoadingOTP(true)
        try {
            const res = await handleXacThucOTP(otp, email)
            console.log("res: ", res);
            
            if(res.success === true) {
                // message.success('Đăng ký tài khoản thành công! Bạn có thể đăng nhập!')
                message.success(res.message)
                formOTP.resetFields()
                form.resetFields()
                handleCancel()
                navigate("/login-web")
            } else {
                notification.error({ 
                    message: "Xác thực OTP không thành công!",
                    description:
                        res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                })
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            notification.error({
                message: "Xác thực OTP không thành công!",
                description: "Đã xảy ra lỗi, vui lòng thử lại!",
                duration: 5
            });
        }
        setIsLoadingOTP(false)
    }

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
                        <a className="current">Đăng ký</a>
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

            <div className="rts-register-area rts-section-gap bg_light-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="registration-wrapper-1">
                                <h3 className="title">Đăng ký tài khoản của bạn</h3>
                                <Form
                                form={form}
                                className="registration-form"                                
                                layout="vertical"                                    
                                onFinish={onFinish} 
                                >
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
                                        labelCol={{span: 24}}
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

                                    <Form.Item >                                       
                                        <Button loading={isLoading} 
                                                type="primary" 
                                                size='large'
                                                style={{border: "none", lineHeight: "10px"}}
                                                className="rts-btn btn-primary"
                                                onClick={() => form.submit()}>
                                            Đăng ký 
                                        </Button>                                            
                                    </Form.Item>

                                    <div className="another-way-to-registration">
                                        <div className="registradion-top-text">
                                            <span>&nbsp; Đã có tài khoản?  &nbsp;</span>
                                        </div>                                        
                                        <p> <a onClick={() => navigate('/login-web')} style={{color: "green"}}>Bấm vào đây để đăng nhập!</a></p>
                                    </div>
                                </Form>  


                                <Modal 
                                maskClosable={false} 
                                title="Vui lòng nhập mã OTP để xác thực tài khoản!" 
                                open={isModalOpen} 
                                onOk={() => formOTP.submit()} 
                                onCancel={handleCancel}>
                                    <Divider />
                                    <Form
                                        form={formOTP}
                                        name="basic"        
                                        layout="vertical"                                                        
                                        onFinish={handleXacThucTaiKhoanOTP}
                                        autoComplete="off"
                                        loading={isLoadingOTP}
                                    >
                                        <Row gutter={[20,15]}>
                                            <Col span={24} md={24} sm={24} xs={24}>
                                                <Form.Item hidden name="email" ><Input /></Form.Item>

                                                <Form.Item
                                                    hasFeedback
                                                    layout="vertical"
                                                    label="Nhập mã OTP vừa gửi tới email đăng ký"
                                                    name="otp"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Nhập chính xác OTP của bạn!',
                                                        },
                                                    ]}
                                                >
                                                <InputNumber style={{width: "max-content"}} placeholder="Nhập mã OTP" />
                                                </Form.Item>
                                            </Col> 
                                        </Row>
                                    </Form>
                                </Modal>                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Register
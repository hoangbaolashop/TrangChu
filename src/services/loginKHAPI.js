import axios from "../utils/axios-customize"

export const handleRegister = (email, password, fullName, phone) => {
    const URL_BACKEND = '/api/acckh/register-kh'
    const data = {
        email, password, fullName, phone
    }
    return axios.post(URL_BACKEND, data)
}

export const handleLogin = (email, password) => {
    const URL_BACKEND = '/api/acckh/login-kh'
    const data = {
        email, password
    }
    return axios.post(URL_BACKEND, data)
}

export const handleLogout = () => {
    const URL_BACKEND = '/api/acckh/logout-kh'    
    return axios.post(URL_BACKEND)
}

export const handleQuenPassword = (email_doimk) => {
    const URL_BACKEND = '/api/acckh/quen-mat-khau'   
    return axios.post(URL_BACKEND, {email_doimk})
}

export const handleXacThucOTP = (otp, email) => {
    const URL_BACKEND = '/api/acckh/xac-thuc-otp-kh'
    const data = {
        otp, email
    }
    return axios.post(URL_BACKEND, data)
}

export const checkTrangThaiIsActive = (token) => {
    const URL_BACKEND = '/api/acckh/check-status'    
    return axios.get(URL_BACKEND, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
}
import axios from "../utils/axios-customize"

export const callRegister = (email, password, firstName, lastName, address, phone) => {
    const URL_BACKEND = '/api/accadmin/register-admin'
    const data = {
        email, password, firstName, lastName, address, phone
    }
    return axios.post(URL_BACKEND, data)
}

export const callLogin = (email, password) => {
    const URL_BACKEND = '/api/accadmin/login-admin'
    const data = {
        email, password
    }
    return axios.post(URL_BACKEND, data)
}

export const callLogout = () => {
    const URL_BACKEND = '/api/accadmin/logout-admin'    
    return axios.post(URL_BACKEND)
}
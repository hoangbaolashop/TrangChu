import axios from "../utils/axios-customize"

export const orderDH = (lastName, firstName, email, address, phone, note, products, soTienGiamGia, giamGia, soTienCanThanhToan, thanhTien, tongSoLuong, idKhachHang) => {
    const URL_BACKEND = `/api/order/dat-hang`    
    const data = {lastName, firstName, email, address, phone, note, products, soTienGiamGia, giamGia, soTienCanThanhToan, thanhTien, tongSoLuong, idKhachHang}
    return axios.post(URL_BACKEND, data)
}

export const orderDHVNPay = (lastName, firstName, email, address, phone, note, products, soTienGiamGia, giamGia, soTienCanThanhToan, thanhTien, tongSoLuong, idKhachHang) => {
    const URL_BACKEND = `/api/order/dat-hang-thanh-toan-vnpay`    
    const data = {lastName, firstName, email, address, phone, note, products, soTienGiamGia, giamGia, soTienCanThanhToan, thanhTien, tongSoLuong, idKhachHang}
    return axios.post(URL_BACKEND, data)
}
export const orderDHSePay = (lastName, firstName, email, address, phone, note, products, soTienGiamGia, giamGia, soTienCanThanhToan, thanhTien, tongSoLuong, idKhachHang) => {
    const URL_BACKEND = `/api/order/dat-hang-thanh-toan-sepay`    
    const data = {lastName, firstName, email, address, phone, note, products, soTienGiamGia, giamGia, soTienCanThanhToan, thanhTien, tongSoLuong, idKhachHang}
    return axios.post(URL_BACKEND, data)
}

export const historyOrderByIdKH = (query) => {
    const URL_BACKEND = `/api/order/find-all-order?${query}`    
    return axios.get(URL_BACKEND)
}

export const handleHuyOrder = (query) => {
    const URL_BACKEND = `/api/order/huy-order?idOrder=${query}`    
    return axios.post(URL_BACKEND)
}

export const getThongBaoThanhToan = () => {
    const URL_BACKEND = `/api/order/vnpay_return`    
    return axios.get(URL_BACKEND)
}

export const findOneOrderById = (query) => {
    const URL_BACKEND = `/api/order/find-one-order?${query}`    
    return axios.get(URL_BACKEND)
}

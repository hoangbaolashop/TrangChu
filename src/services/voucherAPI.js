import axios from "../utils/axios-customize"

export const fetchAllVoucher = (query) => {
    const URL_BACKEND = `/api/voucher/get-voucher?${query}`    
    return axios.get(URL_BACKEND)
}

export const createVoucher = (code, dieuKien, giamGia) => {
    return axios.post('/api/voucher/create-voucher', {
        code, dieuKien, giamGia
    })
}

export const deleteVoucher = (id) => {
    return axios.delete(`/api/voucher/delete-voucher/${id}`)
}

export const updateVoucher = (_id, code, dieuKien, giamGia) => {
    return axios.put('/api/voucher/update-voucher', {
        _id, code, dieuKien, giamGia
    })
}
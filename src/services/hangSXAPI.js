import axios from "../utils/axios-customize"

export const fetchAllHangSX = (query) => {
    const URL_BACKEND = `/api/hangsx/get-hang-sx?${query}`    
    return axios.get(URL_BACKEND)
}

export const createHangSX = (TenHangSX, IdLoaiSP) => {
    return axios.post('/api/hangsx/create-hang-sx', {
        TenHangSX, IdLoaiSP
    })
}

export const deleteHangSX = (nameHSX) => {
    return axios.delete(`/api/hangsx/delete-hang-sx/${nameHSX}`)
}

export const updateHangSX = (TenHangSX, IdLoaiSP) => {
    return axios.put('/api/hangsx/update-hang-sx', {
        TenHangSX, IdLoaiSP
    })
}
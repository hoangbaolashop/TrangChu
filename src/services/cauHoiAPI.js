import axios from "../utils/axios-customize"

export const fetchAllCauHoi = (query) => {
    const URL_BACKEND = `/api/cauhoi/get-cau-hoi?${query}`    
    return axios.get(URL_BACKEND)
}

export const createCauHoi = (fullName, email, cauHoi) => {
    return axios.post('/api/cauhoi/create-cau-hoi', {
        fullName, email, cauHoi
    })
}

export const deleteCauHoi = (id) => {
    return axios.delete(`/api/cauhoi/delete-cau-hoi/${id}`)
}

export const updateCauHoi = (_id, fullName, email, cauHoi, cauTraLoi) => {
    return axios.put('/api/cauhoi/update-cau-hoi', {
        _id, fullName, email, cauHoi, cauTraLoi
    })
}
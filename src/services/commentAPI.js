import axios from "../utils/axios-customize"

export const fetchAllComment = (query) => {
    const URL_BACKEND = `/api/comment/get-comment?${query}`    
    return axios.get(URL_BACKEND)
}

export const createComment = (title, soSaoDanhGia, idKH, idSP) => {
    return axios.post('/api/comment/create-comment', {
        title, soSaoDanhGia, idKH, idSP
    })
}

export const deleteComment = (id) => {
    return axios.delete(`/api/comment/delete-comment/${id}`)
}
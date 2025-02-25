import axios from "../utils/axios-customize"

export const fetchAllProduct = (query) => {
    const URL_BACKEND = `/api/product/get-product?${query}`    
    return axios.get(URL_BACKEND)
}

export const createProduct = (TenSP, IdHangSX, IdLoaiSP, sizes, Image, ImageSlider, MoTa, MoTaChiTiet, GiamGiaSP) => {
    return axios.post('/api/product/create-product', {
        TenSP, IdHangSX, IdLoaiSP, sizes, Image, ImageSlider, MoTa, MoTaChiTiet, GiamGiaSP
    })
}

export const deleteProduct = (id) => {
    return axios.delete(`/api/product/delete-product/${id}`)
}

export const updateProduct = (_id, TenSP, IdHangSX, IdLoaiSP, sizes, Image, ImageSlider, MoTa, MoTaChiTiet, GiamGiaSP) => {
    return axios.put('/api/product/update-product', {
        _id, TenSP, IdHangSX, IdLoaiSP, sizes, Image, ImageSlider, MoTa, MoTaChiTiet, GiamGiaSP
    })
}

export const importProducts = (data, originalFileName) => {
    const formData = new FormData();
    
    // Thêm file vào form data (giả sử bạn đã chọn file)
    formData.append('file', data);
    
    // Thêm originalFileName vào form data
    formData.append('originalFileName', originalFileName);

    // return axios.post('/api/product/import-products', data, originalFileName)
    return axios.post('/api/product/import-products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',  // Phải chỉ định loại content này khi gửi file
        }
    });
}

export const fetchAllProductToCategoryNoiBat = (query) => {
    const URL_BACKEND = `/api/product/get-product-idloaisp-noibat?${query}`    
    return axios.get(URL_BACKEND)
}

export const fetchAllProductToCategoryLienQuan= (query) => {
    const URL_BACKEND = `/api/product/get-product-idloaisp-lien-quan?${query}`    
    return axios.get(URL_BACKEND)
}

export const fetchSPDetail = (id) => {
    const URL_BACKEND = `/api/product/get-detail-product?id=${id}`    
    return axios.get(URL_BACKEND)
}

export const timSPCanCheckSoLuongTon = (query) => {
    const URL_BACKEND = `/api/product/get-detail-product-check?${query}`    
    return axios.get(URL_BACKEND)
}
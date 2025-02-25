import axios from "../utils/axios-customize"

export const fetchAllAccKH = (query) => {
    const URL_BACKEND = `/api/acckh/get-kh?${query}`    
    return axios.get(URL_BACKEND)
}

export const fetchOneAccKH = (id) => {
    const URL_BACKEND = `/api/acckh/get-one-kh?${id}`    
    return axios.get(URL_BACKEND)
}

export const deleteAccKH = (id) => {
    return axios.delete(`/api/acckh/delete-kh/${id}`)
}

export const updateAccKH = (id, fullName, IdVoucher) => {
    return axios.put('/api/acckh/update-kh', {
        id, fullName, IdVoucher
    })
}

export const khoaAccKH = (id, isActive) => {
    return axios.put('/api/acckh/khoa-kh', {
        id, isActive
    })
}

export const doiThongTinKH = (_idAcc, fullName, email, phone, address, passwordMoi, image) => {
    return axios.put('/api/acckh/doi-thong-tin', {
        _idAcc, fullName, email, phone, address, passwordMoi, image
    })
}

// export const loginGG = (idToken ) => {
//     return axios.post('/api/acckh/auth/google', {
//         idToken 
//     })
// }
// export const loginGG = (idToken) => {
//     // Send the idToken to your backend to verify the user's identity
//     return axios.post('/api/acckh/auth/google', {
//         idToken,  // Send the ID token received from Google login
//     })
//     .then(response => {
//         // Handle the successful response from the backend
//         console.log('Google login successful', response.data);
//         return response.data;  // Return data to handle it in the frontend
//     })
//     .catch(error => {
//         // Handle error in case of failure
//         console.error('Error logging in with Google:', error);
//         throw error;  // You may throw or return a specific error message here
//     });
// };
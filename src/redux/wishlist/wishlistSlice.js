import { createSlice } from '@reduxjs/toolkit';
import { message, notification } from 'antd';

/**
 * Giả sử sản phẩm có cấu trúc như sau:
 * product = { 
 *    _id: 'abc', 
 *    name: 'Tên sản phẩm', 
 *    size: 'M', 
 *    price: 100000, 
 *    discountCode: 'DISCOUNT10' 
 * }
 * 
 * cart = [
 *    { 
 *        quantity: 1, 
 *        _id: 'abc',  
 *        detail: { _id: 'abc', name: 'Tên sản phẩm', size: 'M', price: 100000, discountCode: 'DISCOUNT10' },
 *        customerId: '12345' // ID của khách hàng
 *    },
 *    { 
 *        quantity: 2, 
 *        _id: '123', 
 *        detail: { _id: '123', name: 'Sản phẩm khác', size: 'L', price: 150000, discountCode: '' },
 *        customerId: '12345' // ID của khách hàng
 *    }
 * ]
 */

const initialState = {
    Wishlist: [], 
    customerId: null, 
};

const initializeWishlist = (customerId) => {
    const savedWishlist = localStorage.getItem(`wishlist-${customerId}`);
    return savedWishlist ? JSON.parse(savedWishlist) : []; // Nếu có ds yêu thích thì parse từ JSON, nếu không thì trả về mảng rỗng
};

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {             

        // Khi login, khởi tạo ds yêu thích từ localStorage
        doLoginActionWishlist: (state, action) => {
            const { customerId } = action.payload;
            state.customerId = customerId;
            const savedWishlist = initializeWishlist(customerId);
            state.Wishlist = savedWishlist;
        },

        // Thêm sản phẩm vào ds yêu thích
        doAddActionWishlist: (state, action) => {
            let { dataDetailSP, customerId, selectedItemss, selectedSize } = action.payload;

            console.log("action: ",action);

            let product = dataDetailSP
            let priceDaChon = selectedItemss;  // priceDaChon người dùng đã chọn (ví dụ: '100000')
            let sizeDaChon = selectedSize;  // sizeDaChon người dùng đã chọn (ví dụ: '256GB')


            console.log("product: ",product);            
            console.log("customerId: ",customerId);
            console.log("gia nguoi dung chon: ",priceDaChon);
            console.log("size nguoi dung chon: ",sizeDaChon);                   

            // Lưu ID khách hàng vào state (có thể được lấy từ login hoặc session)
            state.customerId = customerId;

            // Kiểm tra xem sản phẩm đã có trong ds yêu thích chưa
            const existingProductIndex = state.Wishlist.findIndex(
                item => item._id === product._id && item.sizeDaChon === sizeDaChon && item.customerId === customerId
            );

            if (existingProductIndex !== -1) {
                // Nếu sản phẩm đã có trong ds yêu thích, cập nhật số lượng
                message.error("Sản phẩm đã có trong danh sách yêu thích");
            } else {
                // Nếu sản phẩm chưa có trong ds yêu thích, thêm mới vào ds yêu thích
                state.Wishlist.push({
                    _id: product._id,
                    detail: product,
                    sizeDaChon: sizeDaChon,
                    priceDaChon: priceDaChon || 0,
                    customerId: customerId // Lưu ID khách hàng vào sản phẩm trong ds yêu thích
                });
                message.success("Sản phẩm đã được thêm vào danh sách yêu thích");
            }           

            // Lưu ds yêu thích vào localStorage sau khi thay đổi
            localStorage.setItem(`wishlist-${customerId}`, JSON.stringify(state.Wishlist));
        },        

        // Xóa sản phẩm khỏi ds yêu thích
        doDeleteItemWishlistAction: (state, action) => {
            const { productId, size, customerId } = action.payload;

            // Tìm và xóa sản phẩm trong ds yêu thích
            state.Wishlist = state.Wishlist.filter(
                item => item._id !== productId || item.sizeDaChon !== size || item.customerId !== customerId
            );
            
            message.success("Sản phẩm đã được xóa khỏi danh sách yêu thích");
            // Lưu ds yêu thích vào localStorage sau khi thay đổi
            localStorage.setItem(`wishlist-${customerId}`, JSON.stringify(state.Wishlist));
        },

        // Xóa ds yêu thích khi logout
        doLogoutActionWishlist: (state) => {
            state.Wishlist = [];
            state.customerId = null;
            // Không xóa ds yêu thích trong localStorage để khi đăng nhập lại, ds yêu thích vẫn được giữ
        },

        // Reset ds yêu thích
        doResetWishlistAction: (state) => {
            state.Wishlist = [];
            state.customerId = null;            
        },
    },
    extraReducers: (builder) => {
        // Không có extraReducers nào ở đây, có thể để trống hoặc thêm logic bất kỳ khi cần.
    },
});

export const { doLoginActionWishlist, doAddActionWishlist, doDeleteItemWishlistAction, doLogoutActionWishlist, doResetWishlistAction } = wishlistSlice.actions;

export default wishlistSlice.reducer;

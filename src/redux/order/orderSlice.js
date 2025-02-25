import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message, notification } from 'antd';
import './css.css'
import { timSPCanCheckSoLuongTon } from '../../services/productAPI';
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
    carts: [], // Giỏ hàng ban đầu rỗng
    customerId: null, // ID của khách hàng (có thể được set từ ngoài, ví dụ khi đăng nhập)
    discountCode: '' ,
    totalQuantity: 0,
    totalPriceChuaGiam: 0,
    totalPrice: 0,
    soPhanTramGiam: 0,
    vouchers: [], // Mảng này chứa danh sách voucher của người dùng
    appliedDiscount: 0,
    appliedVoucherCode: null, // Voucher chưa được áp dụng voucher
    orderPlaced: false, // Flag mới để theo dõi trạng thái đặt hàng
};

// Hàm khởi tạo giỏ hàng khi login
const initializeCart = (customerId) => {
    // Lấy giỏ hàng từ localStorage theo customerId
    const savedCart = localStorage.getItem(`cart-${customerId}`);
    return savedCart ? JSON.parse(savedCart) : []; // Nếu có giỏ hàng thì parse từ JSON, nếu không thì trả về mảng rỗng
};

export const checkProductAvailability = createAsyncThunk(
    'order/checkProductAvailability',
    async ({ dataDetailSP, selectedSize, currentQuantity }, { rejectWithValue }) => {
        try {
            const query = `dataDetailSP=${dataDetailSP._id}&selectedSize=${selectedSize}&quantity=${currentQuantity}`;
            const response = await timSPCanCheckSoLuongTon(query);
            if (response.status !== 200) {
                notification.error({
                    message: 'Sản phẩm không thể thêm vào Giỏ hàng ❌',
                    description: response.message,
                    placement: 'topRight',
                    className: 'custom-error'  // Thêm lớp CSS tùy chỉnh
                })
                return false;
            }
            return true;  // Trả về true nếu số lượng đủ
        } catch (error) {
            return message.error("Lỗi khi kiểm tra số lượng");  // Nếu có lỗi trong quá trình kiểm tra
        }
    }
);

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {   
        setOrderPlaced: (state, action) => {
            state.orderPlaced = action.payload;
        },   
        setVouchers: (state, action) => {
            state.vouchers = action.payload;
        },
        applyVoucher: (state, action) => {
            const { voucherCode } = action.payload;

            // Kiểm tra xem voucher đã được áp dụng hay chưa
            if (state.appliedVoucherCode) {
                notification.error({
                    message: 'Voucher đã được áp dụng',
                    description: `Voucher ${state.appliedVoucherCode} đã được áp dụng. Bạn không thể áp dụng lại.`,
                });
                return;
            }

            // Kiểm tra voucher có tồn tại trong danh sách voucher của khách hàng
            const voucher = state.vouchers.vouchers.find(v => v.code === voucherCode);

            if (!voucher) {
                notification.error({
                    message: 'Mã voucher không hợp lệ',
                    description: 'Mã voucher bạn nhập không tồn tại trong hệ thống.',
                });
                return;
            }

            // Kiểm tra điều kiện của voucher
            const totalAmount = state.totalPrice; // Tổng giá trị giỏ hàng
            if (totalAmount < voucher.dieuKien) {
                notification.error({
                    message: 'Điều kiện không thỏa mãn',
                    description: `Giá trị đơn hàng phải lớn hơn ${voucher.dieuKien}đ để áp dụng voucher`,
                });
                return;
            }

            // Nếu voucher hợp lệ, tính giảm giá và cập nhật tổng giá trị giỏ hàng
            const discountAmount = (totalAmount * voucher.giamGia) / 100; // Giảm giá tính theo phần trăm
            state.appliedDiscount = discountAmount;

            // Cập nhật lại giá trị giỏ hàng sau khi giảm giá
            state.totalPrice -= discountAmount;

            // Cập nhật voucher đã được áp dụng
            state.appliedVoucherCode = voucherCode;

            state.soPhanTramGiam = voucher.giamGia

            notification.success({
                message: 'Voucher đã được áp dụng',
                description: `Giảm giá ${voucher.giamGia}% cho đơn hàng.`,
            });
        },

        // Khi login, khởi tạo giỏ hàng từ localStorage
        doLoginActionCart: (state, action) => {
            const { customerId } = action.payload;
            state.customerId = customerId;

            // Kiểm tra xem giỏ hàng đã được đặt thành công hay chưa
            if (state.orderPlaced) {
                // Nếu đã đặt hàng, không khôi phục giỏ hàng từ localStorage
                state.carts = [];
                state.totalQuantity = 0;
                return; // Không khôi phục giỏ hàng từ localStorage
            }

            // Nếu chưa đặt hàng, khôi phục giỏ hàng từ localStorage
            const savedCart = localStorage.getItem(`cart-${customerId}`);
            if (savedCart) {
                state.carts = JSON.parse(savedCart);
            } else {
                state.carts = [];
            }

            state.totalQuantity = state.carts.reduce((total, item) => total + item.quantity, 0);
        },                  
        
        doAddAction: (state, action) => {
            let { dataDetailSP, currentQuantity, discountCode, customerId, selectedItemss, selectedSize } = action.payload;

            console.log("action: ",action);

            let product = dataDetailSP
            let quantity = currentQuantity
            let priceDaChon = selectedItemss;  // priceDaChon người dùng đã chọn (ví dụ: '100000')
            let sizeDaChon = selectedSize;  // sizeDaChon người dùng đã chọn (ví dụ: '256GB')


            console.log("product: ",product);
            console.log("quantity: ",quantity);
            console.log("discountCode: ",discountCode);
            console.log("customerId: ",customerId);
            console.log("gia nguoi dung chon: ",priceDaChon);
            console.log("size nguoi dung chon: ",sizeDaChon);                   

            // Lưu ID khách hàng vào state (có thể được lấy từ login hoặc session)
            state.customerId = customerId;
            state.discountCode = discountCode;
            state.orderPlaced = false
            
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingProductIndex = state.carts.findIndex(
                item => item._id === product._id && item.sizeDaChon === sizeDaChon && item.customerId === customerId
            );

            if (existingProductIndex !== -1) {
                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
                state.carts[existingProductIndex].quantity += quantity;
                // message.success("Sản phẩm đã được thêm vào Giỏ hàng");
                notification.success({
                    message: "Thêm sản phẩm vào giỏ hàng",
                    description: "Sản phẩm đã được thêm vào Giỏ hàng",
                    placement: 'topLeft',
                    className: 'custom-success'  // Thêm lớp CSS tùy chỉnh
                })
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới vào giỏ hàng
                state.carts.push({
                    _id: product._id,
                    quantity,
                    detail: product,
                    sizeDaChon: sizeDaChon,
                    priceDaChon: priceDaChon || 0,
                    discountCode: discountCode,
                    customerId: customerId // Lưu ID khách hàng vào sản phẩm trong giỏ hàng
                });
                // message.success("Sản phẩm đã được thêm vào Giỏ hàng");
                notification.success({
                    message: "Thêm sản phẩm vào giỏ hàng",
                    description: "Sản phẩm đã được thêm vào Giỏ hàng",
                    placement: 'topLeft',
                    className: 'custom-success'  // Thêm lớp CSS tùy chỉnh
                })
            }

             // Tính tổng số lượng các sản phẩm trong giỏ hàng
            const totalQuantity = state.carts.reduce((total, item) => total + item.quantity, 0);

            // Cập nhật tổng số lượng vào state (giỏ hàng)
            state.totalQuantity = totalQuantity;

            // Tính tổng giá trị giỏ hàng (totalPrice)
            state.totalPriceChuaGiam = state.carts.reduce((total, item) => {
                const discountPrice = item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100));
                return total + (discountPrice * item.quantity);
            }, 0);

            state.totalPrice = state.carts.reduce((total, item) => {
                const discountPrice = item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100));
                return total + (discountPrice * item.quantity);
            }, 0);

            state.soPhanTramGiam = 0
            state.appliedDiscount = 0

            // Lưu giỏ hàng vào localStorage sau khi thay đổi
            localStorage.setItem(`cart-${customerId}`, JSON.stringify(state.carts));
        },

         // Cập nhật sản phẩm trong giỏ hàng (cập nhật số lượng)
        doUpdateCartAction: (state, action) => {
            const { productId, size, quantity, customerId } = action.payload;

            // Tìm sản phẩm cần cập nhật
            const existingProductIndex = state.carts.findIndex(
                item => item._id === productId && item.sizeDaChon === size && item.customerId === customerId
            );
        
            if (existingProductIndex !== -1) {
                state.carts[existingProductIndex].quantity = quantity;
                // Cập nhật tổng số lượng sau khi sửa
                state.totalQuantity = state.carts.reduce((total, item) => total + item.quantity, 0);
                
                // Cập nhật tổng giá trị sau khi sửa số lượng
                state.totalPriceChuaGiam = state.carts.reduce((total, item) => {
                    const discountPrice = item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100));
                    return total + (discountPrice * item.quantity);
                }, 0);

                // Cập nhật tổng giá trị sau khi sửa số lượng
                state.totalPrice = state.carts.reduce((total, item) => {
                    const discountPrice = item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100));
                    return total + (discountPrice * item.quantity);
                }, 0);

                // Reset voucher khi cập nhật số lượng
                state.appliedVoucherCode = null; // Mã voucher sẽ phải được áp dụng lại sau khi thay đổi giỏ hàng
                state.soPhanTramGiam = 0
                state.appliedDiscount = 0
                
                // Lưu giỏ hàng vào localStorage sau khi thay đổi
                localStorage.setItem(`cart-${customerId}`, JSON.stringify(state.carts));
            }
        },

        // Xóa sản phẩm khỏi giỏ hàng
        doDeleteItemCartAction: (state, action) => {
            const { productId, size, customerId } = action.payload;

            // Tìm và xóa sản phẩm trong giỏ hàng
            state.carts = state.carts.filter(
                item => item._id !== productId || item.sizeDaChon !== size || item.customerId !== customerId
            );

            // Cập nhật tổng số lượng sau khi xóa
            state.totalQuantity = state.carts.reduce((total, item) => total + item.quantity, 0);

            // Cập nhật tổng giá trị sau khi xóa sản phẩm
            state.totalPriceChuaGiam = state.carts.reduce((total, item) => {
                const discountPrice = item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100));
                return total + (discountPrice * item.quantity);
            }, 0);

            state.totalPrice = state.carts.reduce((total, item) => {
                const discountPrice = item.priceDaChon - (item.priceDaChon * (item.detail.GiamGiaSP / 100));
                return total + (discountPrice * item.quantity);
            }, 0);

            // Reset voucher khi xóa
            state.appliedVoucherCode = null; // Mã voucher sẽ phải được áp dụng lại sau khi thay đổi giỏ hàng
            state.soPhanTramGiam = 0
            state.appliedDiscount = 0

            message.success("Sản phẩm đã được xóa khỏi Giỏ hàng");
            // Lưu giỏ hàng vào localStorage sau khi thay đổi
            localStorage.setItem(`cart-${customerId}`, JSON.stringify(state.carts));
        },

        // Xóa giỏ hàng khi logout
        doLogoutActionCart: (state) => {
            // state.carts = [];
            // state.totalQuantity = 0;
            // state.customerId = null;
            // Không xóa giỏ hàng trong localStorage để khi đăng nhập lại, giỏ hàng vẫn được giữ

            state.carts = [];
            state.totalQuantity = 0;
            state.customerId = null;
            state.discountCode = '';
            state.soPhanTramGiam = 0;
            state.appliedDiscount = 0;
            state.appliedVoucherCode = null;

            // Xóa giỏ hàng khỏi localStorage khi logout
            localStorage.removeItem(`cart-${state.customerId}`);
        },

        // Reset giỏ hàng
        doResetCartAction: (state) => {
            state.carts = [];
            state.totalQuantity = 0;
            state.customerId = null;

            // Reset voucher khi reset giỏ hàng
            state.appliedVoucherCode = null; // Không còn voucher đã áp dụng khi giỏ hàng bị reset
            state.soPhanTramGiam = 0
            state.appliedDiscount = 0
        },

        // Reset giỏ hàng sau khi đặt hàng thành công
        doResetCartAfterOrder: (state) => {
            state.carts = [];
            state.totalQuantity = 0;
            state.totalPriceChuaGiam = 0;
            state.totalPrice = 0;
            state.soPhanTramGiam = 0;
            state.appliedDiscount = 0;
            state.appliedVoucherCode = null;
            state.discountCode = '';
            state.customerId = null;
            state.vouchers = [];
        },
    },
    extraReducers: (builder) => {
        // Không có extraReducers nào ở đây, có thể để trống hoặc thêm logic bất kỳ khi cần.
    },
});

export const { doAddAction, doUpdateCartAction, doDeleteItemCartAction, setOrderPlaced,
     doResetCartAction, doLoginActionCart, doLogoutActionCart, applyVoucher, setVouchers, doResetCartAfterOrder  } = orderSlice.actions;

export default orderSlice.reducer;

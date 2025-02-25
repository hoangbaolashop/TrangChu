// import { configureStore } from '@reduxjs/toolkit';
// import accountReducer from '../redux/accAdmin/accountSlice';

// export const store = configureStore({
//   reducer: {
//     accountAdmin: accountReducer
//   },
// });

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from '../redux/accAdmin/accountSlice';
import khReducer from '../redux/accKH/accountSlice';
import categoryReducer from '../redux/TheLoai/theLoaiSlice';
import hangSXReducer from '../redux/HangSX/hangSXSlice';
import orderReducer from '../redux/order/orderSlice';
import wishListReducer from '../redux/wishlist/wishlistSlice';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account'] // account will not be persisted
}

const rootReducer = combineReducers({
  accountAdmin: accountReducer,
  accountKH: khReducer,
  category: categoryReducer,
  hangSX: hangSXReducer,
  order: orderReducer,
  wishlist: wishListReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

let persistor = persistStore(store);

export { store, persistor };

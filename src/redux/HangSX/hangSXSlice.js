import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
const baseUrl = import.meta.env.VITE_BACKEND_URL;

// First, create the thunk
export const fetchListHangSX = createAsyncThunk(
  'hangSX/fetchListHangSX',
  async (hangSX, thunkAPI) => {
    const res = await fetch(`${baseUrl}/api/hangsx/get-hang-sx`)
    const data = await res.json()    
    return data
  },
)

const initialState = {
  listHangSXs: [],
  loading: false,
  error: null,
}

export const hangSXSlice = createSlice({
  name: 'hangSX',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListHangSX.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchListHangSX.fulfilled, (state, action) => {
        state.loading = false
        state.listHangSXs = action.payload
      })
      .addCase(fetchListHangSX.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { } = hangSXSlice.actions

export default hangSXSlice.reducer

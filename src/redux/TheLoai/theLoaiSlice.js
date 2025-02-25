import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
const baseUrl = import.meta.env.VITE_BACKEND_URL;

// First, create the thunk
export const fetchListCategory = createAsyncThunk(
  'category/fetchListCategory',
  async (category, thunkAPI) => {
    const res = await fetch(`${baseUrl}/api/category/get-the-loai`)
    const data = await res.json()    
    return data
  },
)

const initialState = {
  listCategorys: [],
  loading: false,
  error: null,
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchListCategory.fulfilled, (state, action) => {
        state.loading = false
        state.listCategorys = action.payload
      })
      .addCase(fetchListCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { } = categorySlice.actions

export default categorySlice.reducer

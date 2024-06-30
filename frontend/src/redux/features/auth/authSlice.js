import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService';
import { toast } from 'react-toastify';


const initialState = {
 isLoggedIn : false,
 user: null,
 users: [],
 twoFactor: false,
 isError: false,
 isSuccess: false,
 isLoading: false,
 message: '',

}

//Register User
export const register = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
try {
    return await authService.register(userData)
} catch (error) {
    const messsage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(messsage)
}
    }
)


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        RESET(state){
            state.twoFactor= false;
            state.isError= false;
            state.isSuccess= false;
            state.isLoading= false;
            state.message= '';
             }
    },
    extraReducers : (builder)=> {
        builder
        .addCase(register.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.isLoggedIn= true;
            state.user = action.payload;

            toast.success("Registration Succesfull")
        })
        .addCase(register.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            state.user = null;

            toast.error(action.payload)
        })
    }
})


export const {RESET} = authSlice.actions

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn

export default authSlice.reducer
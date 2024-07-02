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
        return await authService.register(userData);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
//Login User
export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
      try {
        return await authService.login(userData);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
//Logout User
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
      try {
        return await authService.logout();
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  

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
        //Regsiter User
        .addCase(register.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.isLoggedIn= true;
            state.user = action.payload;
            console.log(action.payload)

            toast.success("Registration Successfull")
        })
        .addCase(register.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            state.user = null;

            toast.error(action.payload)
        })

        //Login User
        .addCase(login.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.isLoggedIn= true;
            state.user = action.payload;
            console.log(action.payload)

            toast.success("Login Successfull")
        })
        .addCase(login.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            state.user = null;

            toast.error(action.payload)
        })

        //Logout User
        .addCase(logout.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(logout.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.isLoggedIn= false;
            state.user = null;

            toast.success(action.payload)
        })
        .addCase(logout.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;

            toast.error(action.payload)
        })
    }
})


export const {RESET} = authSlice.actions

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn

export default authSlice.reducer
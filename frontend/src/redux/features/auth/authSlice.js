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
  
//Get Login Status
export const getLoginStatus = createAsyncThunk(
    "auth/getLoginStatus",
    async (_, thunkAPI) => {
      try {
        return await authService.getLoginStatus();
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
  
//Get User
export const getUser = createAsyncThunk(
    "auth/getUser",
    async (_, thunkAPI) => {
      try {
        return await authService.getUser();
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
  
  
//Update User
export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async (userData, thunkAPI) => {
      try {
        return await authService.updateUser(userData);
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
  
//Send Verification email
export const sendVerificationEmail = createAsyncThunk(
    "auth/sendVerificationEmail",
    async (_, thunkAPI) => {
      try {
        return await authService.sendVerificationEmail();
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
  
//Verify User
export const verifyUser = createAsyncThunk(
    "auth/verifyUser",
    async (verificationToken, thunkAPI) => {
      try {
        return await authService.verifyUser(verificationToken);
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
  
//Verify User
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (userData, thunkAPI) => {
      try {
        return await authService.changePassword(userData);
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
  
//Forgot password
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (userData, thunkAPI) => {
      try {
        return await authService.forgotPassword(userData);
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
  
//Reset password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({userData, resetToken}, thunkAPI) => {
      try {
        return await authService.resetPassword(userData, resetToken);
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

        //Get Login Status
        .addCase(getLoginStatus.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(getLoginStatus.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.isLoggedIn= action.payload;
        })
        .addCase(getLoginStatus.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
        })

        //Get User
        .addCase(getUser.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(getUser.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.isLoggedIn = true;
            state.user= action.payload;
        })
        .addCase(getUser.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            toast.error(action.payload)
        })
        //Update User
        .addCase(updateUser.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(updateUser.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.isLoggedIn = true;
            state.user= action.payload;
            toast.success("Profile Updated Successfully")
        })
        .addCase(updateUser.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            toast.error(action.payload)
        })
        //Send Verification email
        .addCase(sendVerificationEmail.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(sendVerificationEmail.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.message = action.payload;
            toast.success(action.payload)
        })
        .addCase(sendVerificationEmail.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            toast.error(action.payload)
        })
        //Verify User
        .addCase(verifyUser.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(verifyUser.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.message = action.payload;
            toast.success(action.payload)
        })
        .addCase(verifyUser.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            toast.error(action.payload)
        })
        //Change Password
        .addCase(changePassword.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(changePassword.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.message = action.payload;
            toast.success(action.payload)
        })
        .addCase(changePassword.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            toast.error(action.payload)
        })
        //Forgot Password
        .addCase(forgotPassword.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(forgotPassword.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.message = action.payload;
            toast.success(action.payload)
        })
        .addCase(forgotPassword.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            toast.error(action.payload)
        })
        //Rset Password
        .addCase(resetPassword.pending, (state,action)=>{
            state.isLoading = true
        })
        .addCase(resetPassword.fulfilled, (state,action)=>{
            state.isLoading = false
            state.isSuccess= true;
            state.message = action.payload;
            toast.success(action.payload)
        })
        .addCase(resetPassword.rejected, (state,action)=>{
            state.isLoading = false
            state.isError= true;
            state.message= action.payload;
            toast.error(action.payload)
        })
    }
})


export const {RESET} = authSlice.actions

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectUser = (state) => state.auth.user

export default authSlice.reducer
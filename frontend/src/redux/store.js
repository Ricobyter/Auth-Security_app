import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth/authSlice"
import emailReducer from "./features/email/emailSlice"
import filterReducer from "./features/auth/filterSlice"

export const store = configureStore({
    reducer:{
        auth:authReducer,
        email: emailReducer,
        filter: filterReducer
    }
})


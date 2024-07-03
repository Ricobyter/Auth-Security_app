import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../redux/features/auth/authService'
import { toast } from 'react-toastify'

const useRedirectLoggedOutUser = (path) => {
 const navigate = useNavigate()

 useEffect(() => {
 
    let isLoggedIn;
    const redirectLoggedOutUsers = async () => {
        try {
            isLoggedIn = await authService.getLoginStatus()

        } catch (error) {
            console.log(error.message)
        }

        if(!isLoggedIn){
            toast.info("Session expired, please login to continue")
            navigate(path)
            return;
        }
    }
    redirectLoggedOutUsers();
 }, [path,navigate])

}

export default useRedirectLoggedOutUser

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { Button } from './ui/button'
import { app } from "@/firebase"
import { useGoogleMutation } from "@/redux/api/usersApiSlice"
import { useDispatch } from "react-redux"
import { signInSuccess } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function OAuth() {
    const [google] = useGoogleMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const res = await google({
                name: result.user.displayName,
                email: result.user.email,
                googlePhotoUrl: result.user.photoURL
            }).unwrap()
            toast.success(`${result.user.email} Successfully Logged In`)
            navigate('/authenticated/home')
            dispatch(signInSuccess(res))
        } catch (error: any) {
            toast.error(`${error.data}`)
        }
    }

  return (
    <Button className='w-full mt-2' onClick={handleGoogleClick}>
        Continue with Google
    </Button>
  )
}

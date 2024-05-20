import { Link, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useDispatch, useSelector } from 'react-redux'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { useLogoutMutation } from '@/redux/api/usersApiSlice'
import { useState } from 'react'
import { toast } from 'sonner'
import { signoutError, signoutStart, signoutSuccess } from '@/redux/features/auth/authSlice'

export default function UsernameMenu() {
    const { currentUser } = useSelector((state: any) => state.auth)
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(currentUser);
    

    const [logoutApiCall] = useLogoutMutation()

    const logoutCurrentUser = async () => {
        setLoading(true)
        try {
            dispatch(signoutStart())
            await logoutApiCall().unwrap()
            toast.success('Successfully logged out')
            navigate('/')
            dispatch(signoutSuccess())
            setLoading(false)
        } catch (error: any) {
            dispatch(signoutError(error.message))
            setLoading(false)
        }
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center px-3 font-bold hover:text-blue-500 gap-2'>
            <img src={currentUser.profilePicture} alt="" className='w-[30px] rounded-md' />
            {currentUser.email}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
                <Link to='/' className='font-bold hover:text-blue-500'>
                    Dashboard
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Link to='/profile' className='font-bold hover:text-blue-500'>
                    Profile
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Link to='/' className='font-bold hover:text-blue-500'>
                    User Profile
                </Link>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem>
                <Button onClick={() => logoutCurrentUser()} disabled={isLoading} className='flex flex-1 bg-blue-500'>
                    { isLoading ? (
                        <p>Logging out...</p>
                    ) : (
                        <p>Log Out</p>
                    )}
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

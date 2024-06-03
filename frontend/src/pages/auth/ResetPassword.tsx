import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function ResetPassword() {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const handleChange = (e: any) => {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
    };
    console.log(formData);
    

    const navigate = useNavigate()

    const {token} = useParams()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/users/resetPassword/'+token, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json()
            if (data.success === false) {
                toast.error(data.message)
                setLoading(false)
                return;
            } else {
                setLoading(false)
                toast.success('Password successfully reset')
                navigate('/login')
            }
        } catch (error: any) { 
            setLoading(false);
            toast.error(error.message)
        }
 } 

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Reset Password</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className="flex flex-row gap-2">
            <Input 
            type={visible ? 'text' : 'password'} 
            placeholder='password' 
            className='border p-3 rounded-lg' 
            id='password' 
            onChange={handleChange}
            />
            <button type='button' onClick={() => setVisible(!visible)}>
                { visible ? (
                    <FaRegEye />
                ) : (
                    <FaRegEyeSlash />
                )}
            </button>
        </div>
        <Button disabled={loading} >
          {loading ? 'Changing Password...' : 'Change'}
        </Button>
      </form>
    </div>
  )
}

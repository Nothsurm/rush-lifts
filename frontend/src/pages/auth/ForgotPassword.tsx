import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export default function ForgotPassword() {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e: any) => {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/users/forgotPassword', {
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
                toast.success(data.message)
            }
            setLoading(false)
        } catch (error: any) {  
            toast.error(error.data.message)
            setLoading(false)
        }
 } 
  
 return (
    <div className='p-3 max-w-lg mx-auto mt-20'>
      <h1 className='text-3xl text-center font-semibold my-7'>Forgot Password</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <Input 
          type="email" 
          placeholder='email' 
          id='email' 
          onChange={handleChange}
        />
        {loading ? (
            <Button disabled={loading}>Sending Email...</Button>
        ) : (
            <Button>Send Link</Button>
        )}
      </form>
      <div className='flex gap-2 mt-5 text-sm'>
        <p>Remember your password?</p>
        <Link to='/login'>
          <span className='text-blue-700 hover:underline'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}

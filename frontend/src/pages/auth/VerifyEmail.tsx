import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function VerifyEmail() {
    const [value, setValue] = useState("")
    const [email, setEmail] = useState({})
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const navigate = useNavigate()

    console.log(email);
    

    const handleChange = (e: any) => {
        setEmail({
            ...email,
            [e.target.id]: e.target.value
        })
    }

    const handleSendEmail = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        if (email === "") {
            toast.error("Please use a valid email address")
        }
        try {
            const res = await fetch(`/api/users/resend-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(email)
            });
            const data = await res.json()
            if (data.success === false) {
                toast.error(data.message)
                setLoading(false)
                return;
            } else {
                setLoading(false)
                toast.success(`A 4 digit password has been re-sent to your email address`)
            }
        } catch (error) {
            
        }
    }

  return (
    <div className="flex justify-center mt-20">
        <div className="flex flex-col items-center gap-6">
        <h1 className="text-lg font-semibold">Input your 4-digit Password here:</h1>
            <InputOTP 
                maxLength={4}
                value={value}
                onChange={(value) => setValue(value)}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
            </InputOTP>
            <p 
                className="text-blue-500 text-sm cursor-pointer hover:underline flex justify-center mt-10"
                onClick={() => setOpenModal(!openModal)}
            >
                Resend 4 digit password
            </p>
            {openModal ? (
                <div className="text-left -mt-6">
                    <Label htmlFor="email">Email:</Label>
                    <Input 
                        id="email"
                        type='email'
                        className="w-[200px] sm:w-[300px]" 
                        onChange={handleChange}
                    />
                    {loading ? (
                        <Button 
                            className="w-full mt-2"
                            disabled={loading}
                        >
                            Sending...
                        </Button>
                    ): (
                        <Button 
                            className="w-full mt-2"
                            onClick={handleSendEmail}
                        >
                            Send
                        </Button>
                    )}
                </div>
                
            ) : (
                <></>
            )}
        </div>
    </div>
  )
}

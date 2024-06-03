import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function VerifyEmail() {
    const [value, setValue] = useState("")
    const [openModal, setOpenModal] = useState(false)

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
                    />
                    <Button className="w-full mt-2">Send</Button>
                </div>
                
            ) : (
                <></>
            )}
        </div>
    </div>
  )
}

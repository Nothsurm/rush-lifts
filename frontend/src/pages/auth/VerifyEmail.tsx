import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch, useSelector } from "react-redux"
import { registerSuccess } from "@/redux/features/auth/authSlice"

const FormSchema = z.object({
    otp: z.string().min(4, {
      message: "Your one-time password must be 4 characters.",
    }),
  })

export default function VerifyEmail() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          otp: "",
        },
    })
    const [value, setValue] = useState("")
    const [email, setEmail] = useState({})
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { currentUser } = useSelector((state: any) => state.auth)
    
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

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setLoading(true)
        try {
            const res = await fetch(`/api/users/verify-email/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            });
            const data = await res.json()
            if (data.success === false) {
                toast.error(data.message)
                setLoading(false)
                return;
            } else {
                setLoading(false)
                dispatch(registerSuccess())
                toast.success('Email successfully verified')
                navigate('/authenticated/home')
            }
        } catch (error: any) {
            setLoading(false);
            toast.error(error.message)
        }
    }

  return (
    <div className="">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center items-center text-center mt-20">
                <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                        <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="mx-auto mt-4">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        </InputOTP>
                    </FormControl>
                    <FormDescription>
                        Please enter the one-time password sent to your email-address.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
        
                <Button type="submit" className="mt-6">Submit</Button>
            </form>
        </Form>
        <div className="flex flex-col max-w-xl mx-auto items-center">
        <p 
            className="text-blue-500 text-sm cursor-pointer hover:underline mt-10"
            onClick={() => setOpenModal(!openModal)}
        >
            Resend 4 digit password
        </p>
            {openModal ? (
                <div className="">
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

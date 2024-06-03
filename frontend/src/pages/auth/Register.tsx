import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { useRegisterMutation } from "@/redux/api/usersApiSlice"
import { useDispatch } from "react-redux"
import { registerStart, registerFailure } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"
import OAuth from "@/components/OAuth"

const formSchema = z.object({
  username: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Inavlid email address"
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters"
  })
})

export type UserData = z.infer<typeof formSchema>

export default function Register() {
  const [visible, setVisible] = useState(false);
  const [register, {isLoading}] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<UserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: UserData) {
    try {
      dispatch(registerStart())
      await register({
        username: values.username,
        email: values.email,
        password: values.password
      }).unwrap()
      toast.success(`Please verify your email by entering the 4 digit code sent to ${values.email}`)
      navigate('/verifyEmail')
    } catch (error: any) {
      dispatch(registerFailure(error.message))
      toast.error(`${error.data}`)
    }
  }
  return (
    <div className="max-w-64 mx-auto mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
            <p className='flex justify-center font-semibold text-3xl'>Welcome</p>
            <Separator />
            <p className='flex justify-center font-semibold text-3xl text-blue-500'>Register</p>
        </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='Johndoe@email.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}    
          />
          <FormField 
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input 
                      type={visible ? 'text' : 'password'}
                      placeholder='*******' 
                      {...field} 
                    />
                    <button type='button' onClick={() => setVisible(!visible)}>
                      { visible ? (
                        <FaRegEye />
                      ) : (
                        <FaRegEyeSlash />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}    
          />
          { isLoading ? (
            <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 w-full">
              Signing Up...
            </Button>
          ): (
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full">
              Sign Up
            </Button>
          )}
        </form>
        <OAuth />
        <Separator className="mt-4"/>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-2 self-center text-sm">
            <p>Already have an account?</p>
            <Link to='/login' className='text-blue-500 hover:underline'>
              Sign In
            </Link>
          </div>
          
        </div>
      </Form>
    </div>
  )
}

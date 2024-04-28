import React from "react"
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
import { useLoginMutation } from "@/redux/api/usersApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"
import { setRememberMeCredentials } from "@/redux/features/auth/authRememberMeSlice"

const formSchema = z.object({
  email: z.string().email({
    message: "Inavlid email address"
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters"
  })
})

export type UserData = z.infer<typeof formSchema>

export default function Register() {
  const [visible, setVisible] = useState(false)
  const [isChecked, setIsChecked] = useState(false);
  const [login, {isLoading}] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<UserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: UserData) {
    try {
      const res = await login({
        email: values.email,
        password: values.password
      }).unwrap()
      if (isChecked) {
        dispatch(setRememberMeCredentials({...res}))
      } else {
        dispatch(setCredentials({...res}))
      }
      toast.success(`${values.email} Successfully Logged In`)
      navigate('/')
    } catch (error: any) {
      toast.error(`${error.data}`)
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      console.log('checked');
      
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  };

  return (
    <div className="max-w-64 mx-auto mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
            <p className='flex justify-center font-semibold text-3xl'>Welcome</p>
            <Separator />
            <p className='flex justify-center font-semibold text-3xl text-blue-500'>Login</p>
        </div>
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
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox"
              id='rememberMe' 
              onChange={handleChange} 
            />
            <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Remember Me
            </label>
          </div>
          { isLoading ? (
            <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 w-full">
              Signing In...
            </Button>
          ): (
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full">
              Sign In
            </Button>
          )}
        </form>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-2 text-sm">
            <p>Don't have an account?</p>
            <Link to='/register' className='text-blue-500 hover:underline'>
              Register
            </Link>
          </div>
          <Separator />
          <Button className='w-full'>
            Continue with Google
          </Button>
        </div>
      </Form>
    </div>
  )
}

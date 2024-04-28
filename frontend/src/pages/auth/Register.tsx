import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { useRegisterMutation } from "@/redux/api/usersApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"

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
  const [visible, setVisible] = useState(false)
  const [register, {isLoading}] = useRegisterMutation()
  const dispatch = useDispatch()

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
      const res = await register({
        username: values.username,
        email: values.email,
        password: values.password
      }).unwrap()
      dispatch(setCredentials({...res}))
      toast.success(`User ${values.username} Successfully Created`)
    } catch (error: any) {
      toast.error(`${error.data}`)
    }
  }
  return (
    <div className="max-w-64 mx-auto mt-20">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <p className='flex justify-center font-semibold text-3xl'>Welcome</p>
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
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full">
          Sign Up
        </Button>
      </form>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex gap-2 text-sm">
          <p>Already have an account?</p>
          <Link to='/signin' className='text-blue-500 hover:underline'>
            Sign In
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

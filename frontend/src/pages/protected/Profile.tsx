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
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from "@/redux/features/auth/authSlice"
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
  const [login, {isLoading}] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state: any) => state.auth)

  console.log(currentUser.email);
  

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
      dispatch(signInStart())
      const res = await login({
        email: values.email,
        password: values.password
      }).unwrap()
      dispatch(signInSuccess(res))
      toast.success(`${values.email} Successfully Logged In`)
      navigate('/authenticated/home')
    } catch (error: any) {
      dispatch(signInFailure(error.message))
      toast.error(`${error.data}`)
    }
  };

  /*const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  };*/

  return (
    <div className="max-w-96 mx-auto mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
            <p className='flex justify-center font-semibold text-3xl'>Profile</p>
            <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                <img src={currentUser.profilePicture} alt="" className="rounded-full w-full h-full border-4 border-[lightgray] object-cover" />
            </div>
        </div>
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    type='text' 
                    placeholder={currentUser.username} 
                    {...field} 
                />
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
                  <Input 
                    type='email' 
                    placeholder={currentUser.email} 
                    {...field} 
                />
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
              Updating...
            </Button>
          ): (
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full">
              Update
            </Button>
          )}
        </form>
        <Separator className="mt-4"/>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex justify-between text-sm text-red-600">
            <span className="cursor-pointer hover:underline">Delete Account</span>
            <span className="cursor-pointer hover:underline">Sign Out</span>
          </div>
        </div>
      </Form>
    </div>
  )
}

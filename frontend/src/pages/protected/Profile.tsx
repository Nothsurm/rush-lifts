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
import { useEffect, useRef, useState } from "react"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { useLoginMutation } from "@/redux/api/usersApiSlice"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"
import { app } from "@/firebase"

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
  const [imageFile, setImageFile] = useState<any>(null)
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<any>(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const filePickerRef = useRef<HTMLInputElement>(null)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (file) {
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file)) //retrieves image url from users pc
    }
}

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async() => {
    setImageFileUploading(true)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile?.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0))
      },
      (error) => {
        toast.error('Could not upload image (File must be less than 2MB)')
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
          setImageFileUploading(false)
          toast.success('Image upload successfull')
        })
      }
    )
  }

  return (
    <div className="max-w-96 mx-auto mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
            <p className='flex justify-center font-semibold text-3xl'>Profile</p>
            <input 
              type="file" 
              accept='image/*' 
              onChange={handleImageChange} 
              ref={filePickerRef}
              hidden
            />
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
              onClick={() => filePickerRef?.current?.click()}  
            >
              {imageFileUploadProgress && (
                <CircularProgressbar 
                  value={imageFileUploadProgress || 0} 
                  text={`${imageFileUploadProgress}%`} 
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                    }
                  }}
                />
              )}
                <img 
                  src={imageFileUrl || currentUser.profilePicture} 
                  className={`rounded-full w-full h-full border-4 border-[lightgray] object-cover ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} 

                />
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

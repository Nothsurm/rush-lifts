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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { useDispatch, useSelector } from "react-redux"
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutStart, signoutSuccess, signoutError } from "@/redux/features/auth/authSlice"
import { toast } from "sonner"
import { app } from "@/firebase"
import { Label } from "@/components/ui/label"
import { useLogoutMutation } from "@/redux/api/usersApiSlice"

export default function Register() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [imageFile, setImageFile] = useState<any>(null)
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<any>(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const filePickerRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state: any) => state.auth)

  const [logout] = useLogoutMutation()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (imageFileUploading) {
      toast.error('Please wait for image to upload')
    }
    try {
      setLoading(true)
      dispatch(updateStart())
      const res = await fetch(`/api/users/updateUser/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json()
      if (!res.ok) {
        dispatch(updateFailure(data.message))
        setLoading(false)
        toast.error(`${data.message}`)
      } else {
        dispatch(updateSuccess(data))
        toast.success(`${currentUser.email} Successfully Updated`)
        setLoading(false)
        navigate('/authenticated/home')
      }
    } catch (error: any) {
      dispatch(updateFailure(error.message))
      toast.error(`${error.message}`)
      setLoading(false)
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
}

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
          setFormData({ ...formData, profilePicture: downloadURL })
          setImageFileUploading(false)
          toast.success('Image upload successful')
        })
      }
    )
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
        dispatch(deleteUserStart())
        const res = await fetch(`/api/users/deleteUser/${currentUser._id}`, {
            method: 'DELETE'
        });
        const data = await res.json()
        if (!res.ok) {
            dispatch(deleteUserFailure(data.message))
            toast.error('Something went wrong, please try again')
        } else {
            dispatch(deleteUserSuccess(data))
            toast.success('Your account has been successfully deleted')
        }
    } catch (error: any) {
        dispatch(deleteUserFailure(error.message))
    }
};

const handleSignOut = async () => {
  signoutStart()
  try {
    await logout().unwrap()
    dispatch(signoutSuccess())
    toast.success('You have been successfully logged out')
  } catch (error: any) {
    dispatch(signoutError(error.message))
    toast.error('Something went wrong')
  }
}

  return (
    <div className="max-w-96 mx-auto mt-20">
      <form onSubmit={handleSubmit} className="space-y-4 m-1">
        <div className="flex flex-col gap-4">
            <p className='flex justify-center font-semibold text-3xl'>Profile</p>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
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
        <div className="flex flex-row items-center gap-4">
          <Label htmlFor="username" className="">Username:</Label>
          <Input 
            id="username"
            type='text' 
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
        <Label htmlFor="email">Email:</Label>
          <Input 
            id="email"
            type='email' 
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
        <Label htmlFor="password">Password:</Label>
          <Input 
            id="password"
            type={visible ? 'text' : 'password'} 
            placeholder='*******'
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
          { loading ? (
            <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 w-full">
              Updating...
            </Button>
          ): (
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full">
              Update
            </Button>
          )}
        </form>
        <Separator className="mt-4"/>
        <div className="flex flex-col gap-4 mt-4 ml-1 mr-1">
          <div className="flex justify-between text-sm text-red-600">
            <Dialog>
              <DialogTrigger><span className="cursor-pointer hover:underline">Delete Account</span></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <Separator />
                <Button onClick={handleDeleteUser}>Delete Account</Button>
              </DialogContent>
            </Dialog>
            <span className="cursor-pointer hover:underline" onClick={handleSignOut}>Sign Out</span>
          </div>
      </div>
    </div>
  )
}

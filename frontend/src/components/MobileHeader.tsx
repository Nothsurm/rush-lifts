import { useSelector } from 'react-redux';
import { Separator } from './ui/separator';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from './ui/sheet';
import { CircleUserRound, Menu } from 'lucide-react';
import { Button } from './ui/button';

export default function MobileHeader() {
    const { currentUser } = useSelector((state: any) => state.auth)
  return (
    <Sheet>
        <SheetTrigger>
            <Menu className='text-blue-500'/>
        </SheetTrigger>
        <SheetContent className='space-y-3'>
            <SheetTitle>
                {currentUser ? (
                    <span className='flex items-center font-bold gap-2'>
                        <img src={currentUser.profilePicture} alt="" className='w-[30px] rounded-md' />
                        {currentUser?.email}
                    </span>
                ) : (
                    <span>Welcome to RushEats.com!</span>
                )}

            </SheetTitle>
            <Separator />
            <SheetDescription className='flex flex-col gap-4'>
                {currentUser ? (
                    <div className="">
                        Logged In
                    </div>
                ) : (
                    <Button className='flex-1 font-bold bg-blue-500'>
                        Log In
                    </Button>
                )}
            </SheetDescription>
        </SheetContent>
    </Sheet>
  )
}

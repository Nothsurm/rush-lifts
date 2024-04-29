import { Link } from 'react-router-dom'
import { Separator } from './ui/separator'

export default function Logo() {
  return (
    <Link to='/' className="self-center mt-2 flex flex-col font-bold text-3xl">
        <span className="text-blue-500 self-center">RUSH</span>
        <Separator className='self-center w-[200px]' />
        <span className="text-stone-100 self-center">LIFTS</span>
    </Link>
  )
}

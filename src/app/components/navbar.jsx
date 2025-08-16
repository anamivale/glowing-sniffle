import Link from "next/link"
import { HomeIcon, BellIcon, ChatBubbleLeftIcon, UserCircleIcon } from '@heroicons/react/24/solid';
function Navbar() {
    return (
        <nav className='bg-blue-900 dark:text-white p-2 flex border-b justify-between border-gray-100/20' >
            <div className="left">
                <Link href="/" className='mr-2'><HomeIcon className="h-6 w-6 " /></Link>

            </div>
            <div className="right flex">
                <Link href="/messages"><ChatBubbleLeftIcon className="h-6 w-6 mr-3 " /></Link>
                <Link href="/notifications"><BellIcon className="h-6 w-6 mr-3 " /></Link>
                <Link href="/profile"><UserCircleIcon className="h-6 w-6 mr-3 " /></Link>
            </div>


        </nav>)
}

export default Navbar
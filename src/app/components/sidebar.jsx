"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./search";
import {
  HomeIcon, BellIcon, ChatBubbleLeftIcon,
  UserIcon, UserGroupIcon, PlusIcon
} from '@heroicons/react/24/solid';

export default function Sidebar() {

  const pathname = (usePathname() || "").replace(/\/$/, "");
  const isEventsPage = pathname === "/activities";


  return (
    <aside className="w-1/5 bg-blue-900 text-white min-h-full">


      <ul className="w-full">
        <li className="p-4 border-b border-gray-100/20">
          {
            isEventsPage ? (
              <h2 className="text-lg font-bold mb-4 text-center">Activities</h2>

            ) : (
              <Link href="/" className="flex w-full  pb-4 items-center">
                <HomeIcon className="h-6 w-6 mr-2" /> Home
              </Link>
            )
          }
          <SearchBar />
        </li>
        <li className="p-4 border-b border-gray-100/20">
          <Link href="/profile" className="flex w-full  pb-4 items-center">
            <UserIcon className="h-6 w-6 mr-2" /> Profile
          </Link>
        </li>
        <li className="p-4 border-b border-gray-100/20">
          <Link href="/messages" className="flex w-full  pb-4 items-center">
            <ChatBubbleLeftIcon className="h-6 w-6 mr-2" /> Messages
          </Link>
        </li>
        <li className="p-4 border-b border-gray-100/20">
          <Link href="/activities" className="flex w-full  pb-4 items-center">
            <UserGroupIcon className="h-6 w-6 mr-2" /> Activities
          </Link>
        </li>
        <li className="p-4 border-b border-gray-100/20">
          <Link
            href="/create_activity"
            className="flex w-full  pb-4 items-center"
          >
            <PlusIcon className="h-6 w-6 mr-2" />
            Create Activity
          </Link>
        </li>
        <li className="p-4 border-b border-gray-100/20">
          <Link href="/notifications" className="flex w-full  pb-4 items-center">
            <BellIcon className="h-6 w-6 mr-2" /> Notifications
          </Link>
        </li>
      </ul>

    </aside>
  );
}
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "./search";
import {
  HomeIcon, BellIcon, ChatBubbleLeftIcon,
  UserIcon, UserGroupIcon, PlusIcon, ArrowRightOnRectangleIcon,
  Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';
import { getBrowserSupabase } from "@/lib/supabas";
import { useState } from "react";
import GetUser from "./getUser";
import Button from "@/components/ui/Button";

export default function Sidebar() {
  const pathname = (usePathname() || "").replace(/\/$/, "");
  const isEventsPage = pathname === "/events";

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const supabase = getBrowserSupabase();
  const router = useRouter();

  // Fetch user session
  GetUser(setError, setLoading, setUser, supabase, router);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile toggle button (fixed top-left) */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-black text-white"
      >
        {open ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-black text-white transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 z-40
          md:translate-x-0 md:static md:w-1/5
        `}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Alumni Network
        </div>

        <ul className="w-full">
          <li className="p-4 border-b border-gray-100/20">
            {isEventsPage ? (
              <h2 className="text-lg font-bold mb-4 text-center">Events</h2>
            ) : (
              <Link href="/" className="flex w-full pb-4 items-center">
                <HomeIcon className="h-6 w-6 mr-2" /> Home
              </Link>
            )}
            <SearchBar />
          </li>

          {user && (
            <li className="p-4 border-b border-gray-100/20">
              <Link href={`/profile/${user.id}`} className="flex w-full pb-4 items-center">
                <UserIcon className="h-6 w-6 mr-2" /> Profile
              </Link>
            </li>
          )}

          <li className="p-4 border-b border-gray-100/20">
            <Link href="/messages" className="flex w-full pb-4 items-center">
              <ChatBubbleLeftIcon className="h-6 w-6 mr-2" /> Messages
            </Link>
          </li>
          <li className="p-4 border-b border-gray-100/20">
            <Link href="/events" className="flex w-full pb-4 items-center">
              <UserGroupIcon className="h-6 w-6 mr-2" /> Events
            </Link>
          </li>
          <li className="p-4 border-b border-gray-100/20">
            <Link href="/create_activity" className="flex w-full pb-4 items-center">
              <PlusIcon className="h-6 w-6 mr-2" />
              Create Activity
            </Link>
          </li>
          <li className="p-4 border-b border-gray-100/20">
            <Link href="/notifications" className="flex w-full pb-4 items-center">
              <BellIcon className="h-6 w-6 mr-2" /> Notifications
            </Link>
          </li>
          <li className="p-4 border-b border-gray-100/20">
            <Button onClick={handleLogout} className="flex items-center" variant="secondary">
              <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
              Logout
            </Button>
          </li>
        </ul>
      </aside>

      {/* Dark overlay when sidebar is open on mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}
    </>
  );
}

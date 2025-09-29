"use client"

import Image from "next/image"
import useProfile from "@/app/components/getProfile"
import Layout from "@/app/components/Layout"
import React from "react"

export default function ProfileCard({ params }) {
  const { id } = React.use(params)
  const { profile, loading, error } = useProfile(id)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <Layout>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!error && !profile && <p className="text-gray-500">Profile not found.</p>}
      {!error && profile && (
        <div className="p-3">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <img
                src={profile?.profile_picture || "/globe.svg"}
                alt="Profile Avatar"
                className="rounded-full border-4 border-blue-500 w-44 h-44" />
            </div>

            <div className="flex-1">
              <p className=" text-5xl font-black  mt-1">{profile?.first_name} {profile?.last_name}</p>
              <p className="mt-3">{profile?.bio || "No bio available."}</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 text-sm">
                <p><span className="font-semibold">Year of completion</span> / {profile?.graduation_year}</p>
                <p><span className="font-semibold">Stream</span> / {profile?.Stream}</p>
                <p><span className="font-semibold">Current Address</span> / {profile?.location}</p>
                <p><span className="font-semibold">Occupation</span> / {profile?.current_occupation}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 text-center mt-10 bg-gray-50 py-6 px-6 rounded-xl shadow-inner">
            <button className="hover:bg-blue-100 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-900">12</h3>
              <p className="text-gray-600">Events Created</p>
            </button>
            <button className="hover:bg-blue-100 p-4 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-900">24</h3>
              <p className="text-gray-600">Events Attended</p>
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

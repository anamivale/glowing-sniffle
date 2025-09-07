"use client"

import Image from "next/image"
import Layout from "../../components/Layout"
import useProfile from "../../components/getProfile"
import { useSearchParams } from "next/navigation"

export default function ProfileCard() {
  const {id} = useSearchParams()
  
  const {profile, loading, error }= useProfile(id)
  return (
    <Layout>
      <div className="p-3">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Image
              src={profile?.avatar || "globe.svg"}
              alt="Profile Avatar"
              width={180}
              height={180}
              className="rounded-full border-4 border-blue-500"
            />
          </div>

          {/* About Me Section */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-900">About Me</h2>
            <p className="text-red-600 mt-1">
              A Lead UX & UI designer based in Canada
            </p>
            <p className="text-gray-600 mt-3">
              I <span className="font-semibold">design and develop</span> services
              for customers of all sizes, specializing in creating stylish, modern
              websites, web services and online stores. My passion is to design
              digital user experiences through bold interface and meaningful
              interactions.
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 text-sm">
              <p>
                <span className="font-semibold">Year</span> / 4th April 1998
              </p>
              <p>
                <span className="font-semibold">Stream</span> / skype.0404
              </p>
              <p>
                <span className="font-semibold">Address</span> / California, USA
              </p>
              <p>
                <span className="font-semibold">Freelance</span> / Available
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 text-center mt-10 bg-gray-50 py-6 px-6 rounded-xl shadow-inner">
          <button className="hover:bg-blue-100 transition-colors duration-200 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-900">12</h3>
            <p className="text-gray-600">Events Created</p>
          </button>
          <button className="hover:bg-blue-100 transition-colors duration-200 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-900">24</h3>
            <p className="text-gray-600">Events Attended</p>
          </button>
          <button className="hover:bg-blue-100 transition-colors duration-200 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-900">8</h3>
            <p className="text-gray-600">Achievements</p>
          </button>
        </div>
      </div>
    </Layout>
  )
}

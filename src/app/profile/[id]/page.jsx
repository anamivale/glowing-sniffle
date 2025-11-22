"use client"

import Image from "next/image"
import Layout from "@/app/components/Layout"
import ProtectedRoute from "@/app/components/ProtectedRoute"
import React, { useState } from "react"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useProfile } from "@/hooks/useUsers"
import { useProfileEvents } from "@/hooks/useProfileEvents"

export default function ProfileCard({ params }) {
  const { id } = React.use(params)
  const { profile, loading, error } = useProfile(id)
  const {
    createdEvents,
    attendedEvents,
    createdCount,
    attendedCount,
    loading: eventsLoading
  } = useProfileEvents(id)

  const [showCreated, setShowCreated] = useState(false)
  const [showAttended, setShowAttended] = useState(false)

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Loading profile..." />
      </Layout>
    )
  }

  return (
    <ProtectedRoute>
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
              <button
                onClick={() => setShowCreated(!showCreated)}
                className="hover:bg-blue-100 p-4 rounded-lg transition"
              >
                <h3 className="text-2xl font-bold text-blue-900">
                  {eventsLoading ? "..." : createdCount}
                </h3>
                <p className="text-gray-600">Events Created</p>
              </button>
              <button
                onClick={() => setShowAttended(!showAttended)}
                className="hover:bg-blue-100 p-4 rounded-lg transition"
              >
                <h3 className="text-2xl font-bold text-blue-900">
                  {eventsLoading ? "..." : attendedCount}
                </h3>
                <p className="text-gray-600">Events Attended</p>
              </button>
            </div>

            {/* Created Events Section */}
            {showCreated && (
              <div className="mt-6 bg-gray-900 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Events Created</h3>
                {createdEvents.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No events created yet.</p>
                ) : (
                  <div className="space-y-3">
                    {createdEvents.map((event) => (
                      <div key={event.id} className="bg-gray-800 p-3 rounded-lg">
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {event.event_date} • {event.start_time} - {event.end_time}
                        </p>
                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                          {event.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Attended Events Section */}
            {showAttended && (
              <div className="mt-6 bg-gray-900 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Events Attended</h3>
                {attendedEvents.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No events attended yet.</p>
                ) : (
                  <div className="space-y-3">
                    {attendedEvents.map((event) => (
                      <div key={event.id} className="bg-gray-800 p-3 rounded-lg">
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {event.event_date} • {event.start_time} - {event.end_time}
                        </p>
                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                          {event.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

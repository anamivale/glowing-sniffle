'use client';
import React, { useState } from 'react'
import Layout from '../components/Layout'
import { getBrowserSupabase } from '@/lib/supabas';
import { useRouter } from 'next/navigation';
import { GetEvents } from '../components/getActivities';

function Events() {
  const [events, setevents] = useState([])
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserSupabase()
  GetEvents(setError, setLoading, setevents, supabase, router)

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white py-10 px-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Events</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading && <div className="text-center">Loading...</div>}
        {events.length === 0 && !loading && !error && (
          <div className="text-center">No events found.</div>
        )}

        <div className="space-y-6 max-w-3xl mx-auto">
          {events.map((event) => (
            <div key={event.id} className="event bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-3">{event.title}</h2>
              <p className="text-gray-300 mb-6">
                {event.content}
              </p>
              {event.activity_type === "event" && (
                <div>
                  <div className="text-gray-500 mb-4">From {event.start_time} To {event.end_time}</div>

                  <div className="options flex gap-3">
                    <button className="flex-1 bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                      Going
                    </button>
                    <button className="flex-1 bg-gray-800 border border-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition">
                      Maybe
                    </button>
                    <button className="flex-1 bg-gray-800 border border-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition">
                      Not Going
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </Layout>
  )
}

export default Events

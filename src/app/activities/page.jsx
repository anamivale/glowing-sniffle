import React from 'react'
import Layout from '../components/Layout'

function Events() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white py-10 px-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Events</h1>

        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="event bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-3">Event Title</h2>
            <p className="text-gray-300 mb-6">
              Event Description goes here. This is a short summary of the event.
            </p>
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
        </div>
      </div>
    </Layout>
  )
}

export default Events

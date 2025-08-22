"use client";
import { useState } from 'react'
import Layout from '../components/Layout'

function CreateEvents() {
  const [activityType, setActivityType] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-full max-w-lg p-8 rounded-2xl shadow-lg bg-black border border-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Create Event</h1>
          
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2">
                Event Title
              </label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required
                className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2">
                Event Description
              </label>
              <textarea 
                id="description" 
                name="description" 
                required
                rows={4}
                className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Describe your event"
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold mb-2">
                Event Type
              </label>
              <select 
                name="type" 
                id="type"
                value={eventType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">-- Select Type --</option>
                <option value="achievement">Achievement</option>
                <option value="update">Update</option>
                <option value="event">Event</option>
              </select>
            </div>

            {/* Show Date & Time ONLY if activityType === "event" */}
            {activityType === "event" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold mb-2">
                    Date
                  </label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    required
                    className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                <div>
                  <label htmlFor="start_time" className="block text-sm font-semibold mb-2">
                    Start Time
                  </label>
                  <input 
                    type="time" 
                    id="start_time" 
                    name="start_time" 
                    required
                    className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                <div>
                  <label htmlFor="end_time" className="block text-sm font-semibold mb-2">
                    End Time
                  </label>
                  <input 
                    type="time" 
                    id="end_time" 
                    name="end_time" 
                    required
                    className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
              </div>
            )}

            <div className="text-center">
              <button 
                type="submit"
                className="px-6 py-2 rounded-lg font-semibold bg-white text-black hover:bg-gray-200 transition"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default CreateEvents

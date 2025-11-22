"use client";
import { useState } from 'react'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabas';
import { validateEventDate, validateEventDuration } from '../components/validate_datetime';
import { useAuth } from '@/hooks/useAuth';

function CreateEvents() {
  const router = useRouter()
  const supabase = getBrowserSupabase()
  const [timeerror, setTimerror] = useState(null)
  const [dateerror, setDAterror] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const [activityType, setActivityType] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    event_date: null,
    start_time: null,
    end_time: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (formData.event_date != null) {
      const dateErr = validateEventDate(formData.event_date)
      if (dateErr instanceof Error) {
        setDAterror(dateErr.message)
      } else {
        setDAterror(null)
      }
    }
    if (formData.end_time != null && formData.start_time != null) {
      const TimeErr = validateEventDuration(formData.start_time, formData.end_time)
      if (TimeErr instanceof Error) {
        setTimerror(TimeErr.message)
      } else {
        setTimerror(null)
      }
    }


  }
  const { user } = useAuth(false)
  const isDisabled = error || dateerror || timeerror;

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('User not authenticated')
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.from("activities").insert({
        user_id: user.id,
        ...formData,
        activity_type: activityType,
      })
      if (error) {
        setError('Failed to create activity. Please try again.')
        return
      }
      alert("Activity created successfully!")
      router.push("/")
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-full max-w-lg p-8 rounded-2xl shadow-lg bg-black border border-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Create Event</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2" >
                Activity Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter event title"
              />
            </div>

            {/* content */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold mb-2">
                Activity description
              </label>
              <textarea
                id="content"
                name="content"
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Describe your event"
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-semibold mb-2">
                Activity Type
              </label>
              <select
                name="type"
                id="type"
                value={activityType}
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
                    id="event_date"
                    name="event_date"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <p className='text-red-500'>{dateerror}</p>
                </div>

                <div>
                  <label htmlFor="start_time" className="block text-sm font-semibold mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    onChange={handleChange}
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
                    onChange={handleChange}
                    id="end_time"
                    name="end_time"
                    required
                    className="w-full px-4 py-2 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <p className='text-red-500'>{timeerror}</p>

                </div>
              </div>
            )}

            <div className="text-center">
              <button
                disabled={isDisabled}
                type="submit"
                className="px-6 py-2 rounded-lg font-semibold bg-white text-black hover:bg-gray-200 transition"
              >
                Create Event
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-500 text-white p-3 rounded text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  )
}

export default CreateEvents

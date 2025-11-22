"use client";
import { useState } from "react"
import Layout from "../components/Layout"
import ProtectedRoute from "../components/ProtectedRoute"
import { getBrowserSupabase } from "@/lib/supabas"
import { useRouter } from "next/navigation"
import uploadImage from "../components/uploadImage.jsx"
import { useAuth } from "@/hooks/useAuth";

function Page() {
  const router = useRouter()
  const years = Array.from({ length: 2024 - 1990 + 1 }, (_, i) => 1990 + i)
  const supabase = getBrowserSupabase()

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    graduation_year: "",
    Stream: "",
    current_occupation: "",
    location: "",
    phone: "",
    bio: "",
    is_public: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const {user} = useAuth(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('User not authenticated')
      return
    }
    let imageUrl = null
    try {
      setLoading(true)
      if (file) {
        imageUrl = await uploadImage(file, supabase, user.id)
      }
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        ...formData,
        profile_picture: imageUrl
      })
      if (error) {
        setError('Failed to create profile. Please try again.')
        return
      }
      alert("Profile created successfully!")
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-black border border-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Profile Details</h1>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white" />
            <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white" />

            <div>
              <select name="graduation_year" value={formData.graduation_year} onChange={handleChange} className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white">
                <option value="">Select Graduation Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <select name="Stream" value={formData.Stream} onChange={handleChange} className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white">
                <option value="">Select Stream</option>
                <option value="Central">Central</option>
                <option value="South">South</option>
                <option value="North">North</option>
              </select>
            </div>

            <input type="text" name="current_occupation" value={formData.current_occupation} onChange={handleChange} placeholder="Current Occupation" className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white" />
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white" />

            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white" rows={4}></textarea>

            <div>
              <label htmlFor="file" className="block text-sm font-semibold mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                name="file"
                accept="image/*"
                className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} className="h-4 w-4" />
              <span>Make Profile Public</span>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold py-3 rounded-lg transition">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Saving...
                </div>
              ) : (
                'Save Profile'
              )}
            </button>
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

export default Page

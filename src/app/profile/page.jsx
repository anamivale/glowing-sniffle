"use client";
import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { ArrowDownIcon } from "@heroicons/react/24/solid"
import { getBrowserSupabase } from "@/lib/supabas"
import { useRouter } from "next/navigation"
import uploadImage from "../components/uploadImage.jsx"

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
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          setError('Failed to get user session')
          router.push('/login')
          return
        }

        if (!session) {
          router.push('/login')
          return
        }

        setUser(session.user)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          router.push('/login')
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session.user)
        }
        setLoading(false)
      }
    )

    getInitialSession()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

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
        console.error('Profile creation error:', error)
        setError('Failed to create profile. Please try again.')
        return
      }

      alert("Profile created successfully!")
      router.push("/")
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Show error if there's an authentication error
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push('/profile')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // Don't render the form if user is not authenticated
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">Please log in to access your profile.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white p-6 center w-full">
        <h1 className="text-2xl mb-6 font-bold">Profile Details</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange}  className="w-xl border p-2 rounded " /><br />
          <input type="text" name="last_name" placeholder="Last Name"  value={formData.last_name} onChange={handleChange} className="w-xl border p-2 rounded " /><br />

          <select className="w-xl border p-2 rounded " name="graduation_year" value={formData.graduation_year} onChange={handleChange} >
            <option value="">Select Graduation Year </option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}   
            <ArrowDownIcon className="h-10 w-10 text-white" />
          </select><br />

          <select name="Stream" className="w-xl border p-2 rounded " value={formData.Stream} onChange={handleChange}>
            <option value="">Select Stream </option>
            <option value="Central">Central</option>
            <option value="South">South</option>
            <option value="North">North</option>
            <ArrowDownIcon className="h-10 w-10" />
          </select><br />

          <input type="text" name="current_occupation" value={formData.current_occupation} onChange={handleChange} placeholder="Current Occupation" className="w-xl border p-2 rounded " /><br />
          <input type="text" name="location"  value={formData.location} onChange={handleChange} placeholder="Location" className="w-xl border p-2 rounded " /><br />
          <input type="text" name="phone"  value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-xl border p-2 rounded " /><br />

          <textarea placeholder="Bio"  name="bio" value={formData.bio} onChange={handleChange} className="w-xl border p-2 rounded "></textarea><br />

          <input type="file" onChange={handleFileChange} name="file" accept="image/*" className="w-md border p-2 rounded  " /><br />

         
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} />
            Make Profile Public
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 rounded flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Page



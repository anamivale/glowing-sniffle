"use client";
import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { ArrowDownIcon } from "@heroicons/react/24/solid"
import { getBrowserSupabase } from "@/lib/supabas"
import { useRouter } from "next/navigation"

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
  const [user, setUser] = useState(null);

  useEffect(() => {     
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error(error)
        return
      }
      setUser(data.user)
    }
    fetchUser()
  }, [])    

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }
const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from("profiles").insert({
      user_id : user.id,
      ...formData,
    })
    if (error) {
      console.error(error)
      return
    }
    alert("Profile created!")
    router.push("/")


  } 
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white p-6 center w-full" >
        <h1 className="text-2xl mb-6 font-bold">Profile Details</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange}  className="w-xl border p-2 rounded " /><br />
          <input type="text" name="last_name" placeholder="Last Name"  value={formData.last_name} onChange={handleChange} className="w-xl border p-2 rounded " /><br />

          <select className="w-xl border p-2 rounded " name="graduation_year" value={formData.graduation_year} onChange={handleChange} >
            <option value="">Select Graduation Year <ArrowDownIcon className="h-10 w-10 text-white" /></option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}   
          </select><br />

          <select name="Stream" className="w-xl border p-2 rounded " value={formData.Stream} onChange={handleChange}>
            <option value="">Select Stream <ArrowDownIcon className="h-10 w-10" /></option>
            <option value="science">central</option>
            <option value="arts">South</option>
            <option value="business">North</option>
          </select><br />

          <input type="text" name="current_occupation" value={formData.current_occupation} onChange={handleChange} placeholder="Current Occupation" className="w-xl border p-2 rounded " /><br />
          <input type="text" name="location"  value={formData.location} onChange={handleChange} placeholder="Location" className="w-xl border p-2 rounded " /><br />
          <input type="text" name="phone"  value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-xl border p-2 rounded " /><br />

          <textarea placeholder="Bio"  name="bio" value={formData.bio} onChange={handleChange} className="w-xl border p-2 rounded "></textarea><br />

          <input type="file" accept="image/*" className="w-md border p-2 rounded  " /><br />

         
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} />
            Make Profile Public
          </label>

          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded ">
            Save Profile
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Page



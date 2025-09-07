"use client"

import { getBrowserSupabase } from "@/lib/supabas"
import { useEffect, useState } from "react"

export default function useProfile(id) {
  const supabase = getBrowserSupabase()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getProfileData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id)
        .single() 

      if (error) {
        console.error("Error fetching profile:", error)
        setError(error)
        setProfile(null)
      } else {
        setProfile(data)
        setError(null)
      }
      setLoading(false)
    }

    if (id) {
      getProfileData()
    }
  }, [id, supabase])

  return { profile, loading, error }
}

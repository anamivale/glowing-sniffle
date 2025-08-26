"use client";
import { useEffect } from "react"

export default async function GetActivities(setError, setLoading, setActivities, supabase, router) {
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase.from("activities").select("*").order("created_at", { ascending: false })
                if (error) throw error
                setActivities(data)
            } catch (error) {
                router.push('/')
                setError('Failed to fetch activities. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [supabase, setActivities, setError, setLoading])
}

        

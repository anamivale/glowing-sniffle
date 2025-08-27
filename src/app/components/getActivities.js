"use client";
import { useEffect, useState } from "react"


export   function GetEvents(setError, setLoading, setActivities, supabase, router) {
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase.from("activities").select("*").eq("activity_type", "event") .order("created_at", { ascending: false })
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

      

export   function GetUpdates(setError, setLoading, setActivities, supabase, router) {
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase.from("activities").select("*").neq("activity_type", "event") .order("created_at", { ascending: false })
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

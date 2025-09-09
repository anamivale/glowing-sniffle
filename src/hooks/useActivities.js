"use client";
import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabas";

export function useEvents() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = getBrowserSupabase();
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("activity_type", "event")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events. Please try again.");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { activities, loading, error, refetch: () => fetchEvents() };
}

export function useUpdates() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = getBrowserSupabase();
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .neq("activity_type", "event")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        console.error("Error fetching updates:", err);
        setError("Failed to fetch updates. Please try again.");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  return { activities, loading, error, refetch: () => fetchUpdates() };
}

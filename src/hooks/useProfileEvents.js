"use client";
import { useEffect, useState, useCallback } from "react";
import { getBrowserSupabase } from "@/lib/supabas";

export function useProfileEvents(userId) {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileEvents = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const supabase = getBrowserSupabase();

      // Fetch events created by user
      const { data: created, error: createdError } = await supabase
        .from("activities")
        .select("id, title, content, event_date, start_time, end_time, created_at")
        .eq("user_id", userId)
        .eq("activity_type", "event")
        .order("created_at", { ascending: false });

      if (createdError) throw createdError;
      setCreatedEvents(created || []);

      // Fetch events user is attending
      const { data: attendance, error: attendanceError } = await supabase
        .from("event_attendance")
        .select(`
          event_id,
          rsvp_status,
          activities (
            id,
            title,
            content,
            event_date,
            start_time,
            end_time,
            created_at
          )
        `)
        .eq("user_id", userId)
        .eq("rsvp_status", "attending");

      if (attendanceError) throw attendanceError;

      // Extract event details from attendance records
      const attended = attendance
        ?.map((a) => a.activities)
        .filter(Boolean) || [];

      setAttendedEvents(attended);

    } catch (err) {
      console.error("Error fetching profile events:", err);
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileEvents();
  }, [fetchProfileEvents]);

  return {
    createdEvents,
    attendedEvents,
    createdCount: createdEvents.length,
    attendedCount: attendedEvents.length,
    loading,
    error,
    refetch: fetchProfileEvents
  };
}

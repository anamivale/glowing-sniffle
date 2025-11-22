"use client";
import { useEffect, useState, useCallback } from "react";
import { getBrowserSupabase } from "@/lib/supabas";

export function useEventAttendance(userId) {
  const [attendances, setAttendances] = useState({});
  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendances = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const supabase = getBrowserSupabase();

      // Fetch user's attendance records
      const { data: userAttendances, error: attendanceError } = await supabase
        .from("event_attendance")
        .select("event_id, rsvp_status")
        .eq("user_id", userId);

      if (attendanceError) throw attendanceError;

      // Convert to map for easy lookup
      const attendanceMap = {};
      userAttendances?.forEach((a) => {
        attendanceMap[a.event_id] = a.rsvp_status;
      });
      setAttendances(attendanceMap);

      // Fetch attendance counts for all events
      const { data: counts, error: countError } = await supabase
        .from("event_attendance")
        .select("event_id")
        .eq("rsvp_status", "attending");

      if (countError) throw countError;

      // Count attendees per event
      const countMap = {};
      counts?.forEach((c) => {
        countMap[c.event_id] = (countMap[c.event_id] || 0) + 1;
      });
      setAttendanceCounts(countMap);

    } catch (err) {
      console.error("Error fetching attendances:", err);
      setError("Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const updateAttendance = async (eventId, rsvpStatus) => {
    if (!userId) {
      setError("You must be logged in to RSVP.");
      return false;
    }

    try {
      const supabase = getBrowserSupabase();

      // Check if record exists
      const { data: existing, error: checkError } = await supabase
        .from("event_attendance")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("event_attendance")
          .update({ rsvp_status: rsvpStatus })
          .eq("event_id", eventId)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("event_attendance")
          .insert({
            event_id: eventId,
            user_id: userId,
            rsvp_status: rsvpStatus
          });

        if (error) throw error;
      }

      // Update local state optimistically
      setAttendances((prev) => ({
        ...prev,
        [eventId]: rsvpStatus
      }));

      // Update counts
      setAttendanceCounts((prev) => {
        const newCounts = { ...prev };
        const oldStatus = attendances[eventId];

        // Decrement old count if was attending
        if (oldStatus === "attending") {
          newCounts[eventId] = Math.max(0, (newCounts[eventId] || 1) - 1);
        }

        // Increment new count if now attending
        if (rsvpStatus === "attending") {
          newCounts[eventId] = (newCounts[eventId] || 0) + 1;
        }

        return newCounts;
      });

      return true;
    } catch (err) {
      console.error("Error updating attendance:", err);
      setError("Failed to update attendance. Please try again.");
      return false;
    }
  };

  const markGoing = (eventId) => updateAttendance(eventId, "attending");
  const markNotGoing = (eventId) => updateAttendance(eventId, "not_attending");

  const getStatus = (eventId) => attendances[eventId] || null;
  const getCount = (eventId) => attendanceCounts[eventId] || 0;

  return {
    attendances,
    attendanceCounts,
    loading,
    error,
    markGoing,
    markNotGoing,
    getStatus,
    getCount,
    refetch: fetchAttendances
  };
}

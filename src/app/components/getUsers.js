"use client";
import { getBrowserSupabase } from "@/lib/supabas";
import { useEffect, useState } from "react";

export default function GetUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const supabase = getBrowserSupabase();
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, graduation_year, Stream, profile_picture")
        .order("first_name");

      if (!error) setUsers(data);
    }
    fetchUsers();
  }, []);

  return users;
}

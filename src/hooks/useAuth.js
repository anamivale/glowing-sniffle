"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabas";

export function useAuth(redirectOnNoAuth = true) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getBrowserSupabase();

    const getInitialSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError("Failed to get user session");
          if (redirectOnNoAuth) {
            router.push("/");
          }
          return;
        }

        if (!session) {
          if (redirectOnNoAuth) {
            router.push("/");
          }
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error("Auth error:", err);
        setError("An unexpected error occurred");
        if (redirectOnNoAuth) {
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setUser(null);
          if (redirectOnNoAuth) {
            router.push("/");
          }
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setUser(session.user);
        }
        setLoading(false);
      }
    );

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectOnNoAuth]);

  return { user, loading, error };
}

"use client";

import { getBrowserSupabase } from "@/lib/supabas";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const supabase = getBrowserSupabase();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetpassword`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-gray-400">We'll send you a reset link</p>
        </div>

        <div className="bg-black border border-white rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-4">
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Check your email!</p>
                <p className="text-sm">We've sent you a password reset link.</p>
              </div>
              <Link href="/login" className="text-white hover:underline font-semibold">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <p className="text-center text-sm text-gray-400">
                Remember your password?{" "}
                <Link href="/login" className="text-white hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

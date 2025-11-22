"use client";

import { getBrowserSupabase } from "@/lib/supabas";
import Link from "next/link";
import { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const supabase = getBrowserSupabase();

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("Must be at least 8 characters long.");
    if (!/[A-Z]/.test(pwd)) errors.push("Include an uppercase letter.");
    if (!/[0-9]/.test(pwd)) errors.push("Include a number.");
    if (!/[!@#$%^&*]/.test(pwd)) errors.push("Include a special character (!@#$%^&*).");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validationErrors = validatePassword(password);
    if (password !== confirm) {
      validationErrors.push("Passwords do not match.");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

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
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-400">Enter your new password</p>
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
                <p className="font-semibold mb-2">Password Reset Successful!</p>
                <p className="text-sm">You can now log in with your new password.</p>
              </div>
              <Link href="/login" className="text-white hover:underline font-semibold">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="new-password" className="block text-sm font-semibold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  placeholder="Enter new password"
                  className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm new password"
                  className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 text-sm">
                <p className={`flex items-center ${password.length >= 8 ? "text-green-500" : "text-gray-500"}`}>
                  {password.length >= 8 ? "✓" : "○"} At least 8 characters
                </p>
                <p className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-500" : "text-gray-500"}`}>
                  {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase letter
                </p>
                <p className={`flex items-center ${/[0-9]/.test(password) ? "text-green-500" : "text-gray-500"}`}>
                  {/[0-9]/.test(password) ? "✓" : "○"} One number
                </p>
                <p className={`flex items-center ${/[!@#$%^&*]/.test(password) ? "text-green-500" : "text-gray-500"}`}>
                  {/[!@#$%^&*]/.test(password) ? "✓" : "○"} One special character
                </p>
                {confirm && (
                  <p className={`flex items-center ${password === confirm ? "text-green-500" : "text-red-500"}`}>
                    {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Resetting...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

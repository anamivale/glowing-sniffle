"use client";
import { getBrowserSupabase } from "@/lib/supabas";
import React, { useState } from "react";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState([]);
  const supabase = getBrowserSupabase();



  const validatePassword = (pwd) => {
    const newErrors = [];
    if (pwd.length < 8) newErrors.push("Must be at least 8 characters long.");
    if (!/[A-Z]/.test(pwd)) newErrors.push("Include an uppercase letter.");
    if (!/[0-9]/.test(pwd)) newErrors.push("Include a number.");
    if (!/[!@#$%^&*]/.test(pwd)) newErrors.push("Include a special character (!@#$%^&*).");
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword(password);
    if (password !== confirm) {
      validationErrors.push("Passwords do not match.");
    }
    setErrors(validationErrors);

    if (validationErrors.length === 0) {

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrors([error.message]);
      } else {
        alert("Password reset successful! You can now log in with your new password.");
        window.location.href = "/login";
      }
      console.log("Submit to Supabase:", password);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-neutral-100">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Enter a new password for your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="sr-only" htmlFor="new-password">New password</label>
            <input
              className="form-input block w-full rounded-md border-0 bg-neutral-800 py-3 pl-10 pr-3 text-neutral-100 placeholder-neutral-400 focus:bg-neutral-700 focus:ring-0 sm:text-sm"
              id="new-password"
              name="new-password"
              placeholder="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label className="sr-only" htmlFor="confirm-new-password">Confirm new password</label>
            <input
              className="form-input block w-full rounded-md border-0 bg-neutral-800 py-3 pl-10 pr-3 text-neutral-100 placeholder-neutral-400 focus:bg-neutral-700 focus:ring-0 sm:text-sm"
              id="confirm-new-password"
              name="confirm-new-password"
              placeholder="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 text-sm">
            <p className={`flex items-center ${password.length >= 8 ? "text-green-500" : "text-neutral-400"}`}>
              Must be at least 8 characters long.
            </p>
            <p className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-500" : "text-neutral-400"}`}>
              Include an uppercase letter.
            </p>
            <p className={`flex items-center ${/[0-9]/.test(password) ? "text-green-500" : "text-neutral-400"}`}>
              Include a number.
            </p>
            <p className={`flex items-center ${/[!@#$%^&*]/.test(password) ? "text-green-500" : "text-neutral-400"}`}>
              Include a special character (!@#$%^&*).
            </p>
            {confirm && (
              <p className={`flex items-center ${password === confirm ? "text-green-500" : "text-red-500"}`}>
                {password === confirm ? "Passwords match." : "Passwords do not match."}
              </p>
            )}
          </div>

          {errors.length > 0 && (
            <div className="text-red-500 text-sm">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          <div>
            <button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-500 py-3 px-4 text-sm font-semibold text-neutral-100 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all"
              type="submit"
            >
              Reset password
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ResetPassword;

"use client";
import { getBrowserSupabase } from "@/lib/supabas";
import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const supabase = getBrowserSupabase();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetpassword`, 
    });

    if (error) {
      setMessage(error.message);
      alert(error.message);
    } else {
      const successMsg = "Password reset email sent! Check your inbox.";
      setMessage(successMsg);
      alert(successMsg); 
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 group/design-root overflow-x-hidden">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-md shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="space-y-2">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot your password?
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleForgotPassword}
            >
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="email"
                >
                  Your email
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              <button
                className="w-full text-white bg-[var(--primary-color)] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
              >
                Send reset link
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
                <a
                  className="font-medium text-[var(--primary-color)] hover:underline dark:text-blue-500"
                  href="/login"
                >
                  Sign in
                </a>
              </p>
            </form>

            {message && (
              <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-300">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

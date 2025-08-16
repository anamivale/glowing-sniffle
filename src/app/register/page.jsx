"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function RegisterPage() {
    const supabase = createClientComponentClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/profile`
            }
        });
        if (error) {
            alert(error.message);
        } else {
            alert("Check your email for confirmation link!");
        }
    };

    const handleGoogleSignup = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            emailRedirectTo: `${window.location.origin}/profile`
        });
    };

    return (
        <div className="flex min-h-screen b">
            {/* Left Section - Signup Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 ">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Create an account
                </h1>
                <form
                    onSubmit={handleSignup}
                    className="w-full max-w-sm flex flex-col gap-4"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>

                <div className="mt-6 w-full max-w-sm">
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>
                </div>

                <p className="mt-6 text-sm text-white-600">
                    Already have an account?{" "}
                    <a href="/login" className="underline text-blue">
                        Sign in
                    </a>
                </p>
            </div>

            {/* Right Section - Photo */}
            <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center">
                {/* Place your alumni photo here */}
                <img
                    src="/alumni.jpg"
                    alt="Alumni"
                    className="rounded-2xl shadow-lg max-h-[80%] object-cover"
                />
            </div>
        </div>
    );
}

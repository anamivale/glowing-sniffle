"use client";

import { getBrowserSupabase } from "@/lib/supabas";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
    const supabase = getBrowserSupabase();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/create-profile`
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    const handleGoogleSignup = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/create-profile`
            }
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-gray-400">Join the Alumni Network</p>
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
                                <p className="text-sm">We've sent you a confirmation link to complete your registration.</p>
                            </div>
                            <Link href="/login" className="text-white hover:underline font-semibold">
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSignup} className="space-y-5">
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

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Create a password"
                                        className="w-full bg-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                            Creating account...
                                        </div>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>
                            </form>

                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-gray-700"></div>
                                <span className="px-4 text-sm text-gray-500">or</span>
                                <div className="flex-1 border-t border-gray-700"></div>
                            </div>

                            <button
                                onClick={handleGoogleSignup}
                                className="w-full border border-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white hover:text-black transition"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                Continue with Google
                            </button>

                            <p className="mt-6 text-center text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-white hover:underline font-semibold">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

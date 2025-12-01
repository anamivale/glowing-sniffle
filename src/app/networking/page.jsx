"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";

export default function MembersPage() {
    const [search, setSearch] = useState("");
    const { user } = useAuth(false);
    const { users, loading, error, refetch } = useUsers(user?.id);

    const filteredMembers = useMemo(() => {
        if (!users.length) return [];
        return users.filter((m) =>
            m.first_name.toLowerCase().includes(search.toLowerCase()) ||
            m.last_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    return (
        <ProtectedRoute>
        <Layout>
            <main className="min-h-screen bg-black text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Network</h1>
                        <p className="text-gray-400">Connect with fellow alumni</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 max-w-2xl">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search members..."
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Loading and Error States */}
                    {loading && <LoadingSpinner text="Loading members..." />}
                    {error && <ErrorMessage message={error} onRetry={refetch} />}

                    {/* Members Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {!loading && !error && filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <Link
                                    key={member.user_id}
                                    href={`/profile/${member.user_id}`}
                                    className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-200 border border-gray-800 hover:border-gray-700"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={member.profile_picture}
                                            alt={`${member.first_name} ${member.last_name}`}
                                            className="rounded-full border-4 border-blue-500 w-24 h-24 object-cover mb-4"
                                        />
                                        <p className="font-semibold text-lg mb-1">
                                            {member.first_name} {member.last_name}
                                        </p>
                                        <p className="text-sm text-gray-400">{member.Stream}</p>
                                        {member.graduation_year && (
                                            <p className="text-xs text-gray-500 mt-1">Class of {member.graduation_year}</p>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : !loading && !error ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-400">No members found</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
        </Layout>
        </ProtectedRoute>
    );
}

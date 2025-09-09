"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Layout from "../components/Layout";
import { useUsers } from "@/hooks/useUsers";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function MembersPage() {
    const [search, setSearch] = useState("");
    const { users, loading, error, refetch } = useUsers();

    const filteredMembers = useMemo(() => {
        if (!users.length) return [];
        return users.filter((m) =>
            m.first_name.toLowerCase().includes(search.toLowerCase()) ||
            m.last_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    return (
        <Layout>
            <main className="min-h-screen bg-black text-white flex min-w-xl">
                <div className=" w-full max-w-md rounded-2xl shadow-lg p-6">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search members..."
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Loading and Error States */}
                    {loading && <LoadingSpinner text="Loading members..." />}
                    {error && <ErrorMessage message={error} onRetry={refetch} />}

                    {/* Members List */}
                    <div className="space-y-4">
                        {!loading && !error && filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div key={member.user_id} className="flex items-center gap-4">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src={member.profile_picture || '/default-avatar.png'}
                                            alt={`${member.first_name} ${member.last_name}`}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{member.first_name} {member.last_name}</p>
                                        <p className="text-sm text-gray-400">{member.Stream}</p>
                                    </div>
                                </div>
                            ))
                        ) : !loading && !error ? (
                            <p className="text-gray-400 text-center">No members found</p>
                        ) : null}
                    </div>
                </div>
            </main>
        </Layout>
    );
}

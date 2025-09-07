"use client";
import { useState } from "react";
import Layout from "../components/Layout";
import GetUsers from "../components/getUsers";

export default function MembersPage() {
    const [search, setSearch] = useState("");

const users = GetUsers()
    const filteredMembers = users.filter((m) =>
        m.first_name.toLowerCase().includes(search.toLowerCase())||m.last_name.toLowerCase().includes(search.toLowerCase())
    );

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

                    {/* Members List */}
                    <div className="space-y-4">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div key={member.id} className="flex items-center gap-4">
                                    <img
                                        src={member.profile_picture}
                                        alt={member.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold">{member.first_name} {member.last_name}</p>
                                        <p className="text-sm text-gray-400">{member.Stream}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No members found</p>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    );
}

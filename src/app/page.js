"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Layout from "./components/Layout";
import { useEvents, useUpdates } from "@/hooks/useActivities";

// Lazy load icons to reduce initial bundle size
const BriefcaseIcon = dynamic(() => import("@heroicons/react/24/solid").then(mod => ({ default: mod.BriefcaseIcon })));
const CalendarDaysIcon = dynamic(() => import("@heroicons/react/24/solid").then(mod => ({ default: mod.CalendarDaysIcon })));
const HeartIcon = dynamic(() => import("@heroicons/react/24/solid").then(mod => ({ default: mod.HeartIcon })));
const UsersIcon = dynamic(() => import("@heroicons/react/24/solid").then(mod => ({ default: mod.UsersIcon })));

export default function Home() {
  const { activities, loading, error } = useUpdates()
  const { events, eLoading, eError, refetch } = useEvents()

  return (
    <Layout>


      <main className="min-h-screen bg-black text-white">
        <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-b from-black to-gray-900">
          <h1 className="text-5xl font-extrabold mb-6">Reconnect. Remember. Reignite.</h1>
          <p className="max-w-2xl text-lg text-gray-300 mb-8">
            Welcome to the Alumni Network. Reconnect with classmates, relive memories,
            and support the next generation of leaders.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <button className="px-6 py-3 bg-white text-black rounded-xl shadow-lg hover:bg-gray-200 transition">
                Join Now
              </button>
            </Link>
            <Link href="/events">
              <button className="px-6 py-3 border border-white rounded-xl hover:bg-white hover:text-black transition">
                View Events
              </button>
            </Link>
          </div>
        </section>

        <section className="py-16 px-8 grid md:grid-cols-4 gap-8 text-center">
          <Link href="/networking" className="bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition">
            <Suspense fallback={<div className="h-12 w-12 mx-auto bg-gray-700 rounded mb-4 animate-pulse" />}>
              <UsersIcon className="h-12 w-12 mx-auto text-white mb-4" />
            </Suspense>
            <h3 className="text-xl font-semibold">Networking</h3>
            <p className="text-gray-400 mt-2">Find classmates & mentors to grow together.</p>
          </Link>
          <div className="bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition">
            <Suspense fallback={<div className="h-12 w-12 mx-auto bg-gray-700 rounded mb-4 animate-pulse" />}>
              <CalendarDaysIcon className="h-12 w-12 mx-auto text-white mb-4" />
            </Suspense>
            <h3 className="text-xl font-semibold">Events</h3>
            <p className="text-gray-400 mt-2">Stay connected through reunions & activities.</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition">
            <Suspense fallback={<div className="h-12 w-12 mx-auto bg-gray-700 rounded mb-4 animate-pulse" />}>
              <BriefcaseIcon className="h-12 w-12 mx-auto text-white mb-4" />
            </Suspense>
            <h3 className="text-xl font-semibold">Career Support</h3>
            <p className="text-gray-400 mt-2">Explore opportunities & mentorship programs.</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition">
            <Suspense fallback={<div className="h-12 w-12 mx-auto bg-gray-700 rounded mb-4 animate-pulse" />}>
              <HeartIcon className="h-12 w-12 mx-auto text-white mb-4" />
            </Suspense>
            <h3 className="text-xl font-semibold">Give Back</h3>
            <p className="text-gray-400 mt-2">Contribute to scholarships & community projects.</p>
          </div>
        </section>

        {/* Events Preview */}
        <section className="py-16 px-8 bg-gray-950">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {!eLoading && events?.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-gray-900 p-6 rounded-2xl hover:bg-gray-800 transition">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-400 mb-4">Date: {event.event_date}</p>
                <Link href="/events" className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Updates</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {!eLoading && activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="bg-gray-900 p-6 rounded-2xl hover:bg-gray-800 transition">
                <p className="italic text-gray-300 mb-4">
                  {activity.content}
                </p>
                <h4 className="font-semibold">{activity.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="py-16 bg-gradient-to-t from-black to-gray-900 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Legacy Today</h2>
          <p className="text-gray-400 mb-6">Be part of a community that never forgets its roots.</p>
          <Link href="/register">
            <button className="px-6 py-3 bg-white text-black rounded-xl shadow-lg hover:bg-gray-200 transition">
              Register Now
            </button>
          </Link>
        </footer>
      </main>

    </Layout>
  );
}

'use client';
import React from 'react'
import Layout from '../components/Layout'
import { useEvents } from '@/hooks/useActivities';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

function Events() {
  const { activities: events, loading, error, refetch } = useEvents();

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white py-10 px-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Events</h1>

        {loading && <LoadingSpinner text="Loading events..." className="py-20" />}
        {error && <ErrorMessage message={error} onRetry={refetch} className="py-20" />}
        {events.length === 0 && !loading && !error && (
          <div className="text-center py-20 text-gray-400">No events found.</div>
        )}

        <div className="space-y-6 max-w-3xl mx-auto">
          {events.map((event) => (
            <Card key={event.id} className="shadow-md">
              <h2 className="text-xl font-semibold mb-3">{event.title}</h2>
              <p className="text-gray-300 mb-6">
                {event.content}
              </p>
              {event.activity_type === "event" && (
                <div>
                  <div className="text-gray-500 mb-4">
                    From {event.start_time} To {event.end_time}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="primary" className="flex-1">
                      Going
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Maybe
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Not Going
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Events

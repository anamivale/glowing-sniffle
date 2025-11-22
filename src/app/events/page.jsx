'use client';
import React, { useState } from 'react'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import { useEvents } from '@/hooks/useActivities';
import { useEventAttendance } from '@/hooks/useEventAttendance';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

function Events() {
  const { events, loading, error, refetch } = useEvents();
  const { user } = useAuth(false);
  const {
    markGoing,
    markNotGoing,
    getStatus,
    getCount,
    loading: attendanceLoading,
    error: attendanceError
  } = useEventAttendance(user?.id);

  const [updatingEvent, setUpdatingEvent] = useState(null);

  const handleGoing = async (eventId) => {
    setUpdatingEvent(eventId);
    await markGoing(eventId);
    setUpdatingEvent(null);
  };

  const handleNotGoing = async (eventId) => {
    setUpdatingEvent(eventId);
    await markNotGoing(eventId);
    setUpdatingEvent(null);
  };

  return (
    <ProtectedRoute>
    <Layout>
      <div className="min-h-screen bg-black text-white py-10 px-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Events</h1>

        {loading && <LoadingSpinner text="Loading events..." className="py-20" />}
        {error && <ErrorMessage message={error} onRetry={refetch} className="py-20" />}
        {attendanceError && (
          <div className="max-w-3xl mx-auto mb-4">
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
              {attendanceError}
            </div>
          </div>
        )}
        {events.length === 0 && !loading && !error && (
          <div className="text-center py-20 text-gray-400">No events found.</div>
        )}

        <div className="space-y-6 max-w-3xl mx-auto">
          {events.map((event) => {
            const status = getStatus(event.id);
            const goingCount = getCount(event.id);
            const isUpdating = updatingEvent === event.id;

            return (
              <Card key={event.id} className="shadow-md">
                <h2 className="text-xl font-semibold mb-3">{event.title}</h2>
                <p className="text-gray-300 mb-4">
                  {event.content}
                </p>
                {event.activity_type === "event" && (
                  <div>
                    <div className="text-gray-500 mb-2">
                      From {event.start_time} To {event.end_time}
                    </div>

                    {goingCount > 0 && (
                      <div className="text-sm text-gray-400 mb-4">
                        {goingCount} {goingCount === 1 ? 'person' : 'people'} going
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant={status === "attending" ? "primary" : "secondary"}
                        className="flex-1"
                        onClick={() => handleGoing(event.id)}
                        disabled={isUpdating || attendanceLoading}
                      >
                        {isUpdating ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          </span>
                        ) : (
                          <>
                            {status === "attending" && "✓ "}Going
                          </>
                        )}
                      </Button>

                      <Button
                        variant={status === "not_attending" ? "primary" : "secondary"}
                        className="flex-1"
                        onClick={() => handleNotGoing(event.id)}
                        disabled={isUpdating || attendanceLoading}
                      >
                        {isUpdating ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          </span>
                        ) : (
                          <>
                            {status === "not_attending" && "✓ "}Not Going
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  )
}

export default Events

'use client';

import React, { useEffect, useState } from 'react';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
} from 'react-icons/fi';
import { fetchData } from '@/services/apiUtils';

const Notifications = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDockerEvents();
  }, []);

  const fetchDockerEvents = async () => {
    try {
      const data = await fetchData('/api/daemon/event');

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Docker events');
      setLoading(false);
    }
  };

  const renderEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'start':
      case 'create':
        return <FiCheckCircle className="text-green_5" />;
      case 'stop':
      case 'destroy':
        return <FiAlertCircle className="text-red_5" />;
      case 'restart':
        return <FiAlertTriangle className="text-yellow_5" />;
      default:
        return <FiInfo className="text-blue_5" />;
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-red_5">{error}</div>;

  return (
    <div className="bg-white dark:bg-grey-700 shadow-md rounded-lg p-6 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Docker Events</h2>
      {events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border-b pb-2 flex items-center">
              <div className="mr-4">{renderEventIcon(event.status)}</div>
              <div>
                <p className="text-sm font-medium">
                  <strong>{event.Type}:</strong> {event.Action} on{' '}
                  {event.Actor?.Attributes?.name || 'Unnamed container'}
                </p>
                <p className="text-xs text-gray_5">
                  {new Date(event.time * 1000).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events to show</p>
      )}
    </div>
  );
};

export default Notifications;

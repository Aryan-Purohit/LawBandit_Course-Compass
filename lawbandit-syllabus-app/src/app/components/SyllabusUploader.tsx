'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

type CalendarEvent = {
  title: string;
  date: string;
  type: 'Assignment' | 'Reading' | 'Exam';
};

type FormattedCalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: CalendarEvent;
}

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function SyllabusUploader() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [date, setDate] = useState(new Date());

  const calendarEvents = useMemo((): FormattedCalendarEvent[] => {
    return events.map((event) => ({
      title: event.title,
      start: new Date(`${event.date}T00:00:00`),
      end: new Date(`${event.date}T00:00:00`),
      allDay: true,
      resource: event,
    }));
  }, [events]);

  // --- ADD THE CONSOLE LOG IN THIS FUNCTION ---
  const eventPropGetter = useCallback(
    (event: FormattedCalendarEvent) => {
      const type = event.resource.type;
      const className =
        type === 'Exam' ? 'rbc-event-exam' :
        type === 'Assignment' ? 'rbc-event-assignment' :
        'rbc-event-reading';

      // --- THIS IS THE CRITICAL DEBUG LOG ---
      console.log(`Event: "${event.title}", Type: "${type}", Applying Class: "${className}"`);

      return { className };
    },
    []
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setEvents([]);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/process-syllabus', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events || []);
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Uploader UI */}
      <div
        {...getRootProps()}
        className={`p-10 border-4 border-dashed rounded-xl text-center cursor-pointer transition-colors duration-300 ${
          isDragActive
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-gray-500 hover:border-purple-400'
        }`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <p className="text-white">Analyzing Syllabus...</p>
        ) : isDragActive ? (
          <p className="text-purple-300">Drop the syllabus here...</p>
        ) : (
          <p className="text-gray-300">
            Drag & drop a syllabus PDF, or click to select a file
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-8 bg-red-500/20 p-4 rounded-lg text-red-300 text-center">
          {error}
        </div>
      )}

      {/* VIEW RENDER AREA */}
      {events.length > 0 && (
        <div className="mt-10">
          {/* Dropdown to switch views */}
          <div className="flex justify-end mb-4">
            <select
              value={view}
              onChange={(e) => setView(e.target.value as 'calendar' | 'list')}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-48 p-2.5"
            >
              <option value="calendar">Calendar View</option>
              <option value="list">List View</option>
            </select>
          </div>

          {/* Conditional Rendering */}
          {view === 'calendar' ? (
            // Calendar View
            <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-white">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 800 }}
                views={['month']}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                // --- Don't forget to pass the function to the calendar! ---
                eventPropGetter={eventPropGetter}
              />
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    event.type === 'Exam' ? 'bg-red-500/50 text-red-200' :
                    event.type === 'Assignment' ? 'bg-blue-500/50 text-blue-200' :
                    'bg-green-500/50 text-green-200'
                  }`}>
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import SyllabusUploader from './components/SyllabusUploader';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-black-900">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white mb-2">Syllabus to Calendar</h1>
        <p className="text-lg text-gray-400">
          Upload your syllabus to automatically create calendar events.
        </p>
      </div>
      <SyllabusUploader />
    </main>
  );
}
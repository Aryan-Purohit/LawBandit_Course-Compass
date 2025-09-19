'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function SyllabusUploader() {
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setResponseText(''); // Clear previous results

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/process-syllabus', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // For now, just display the raw text extracted from the PDF
        setResponseText(JSON.stringify(data.text, null, 2));
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setResponseText(`Error: ${error.message}`);
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
    <div className="w-full max-w-2xl mx-auto">
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
          <p className="text-white">Processing...</p>
        ) : isDragActive ? (
          <p className="text-purple-300">Drop the syllabus here...</p>
        ) : (
          <p className="text-gray-300">
            Drag & drop a syllabus PDF here, or click to select a file
          </p>
        )}
      </div>

      {responseText && (
        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Extracted Text:</h3>
          <pre className="text-gray-200 text-sm whitespace-pre-wrap">
            {responseText}
          </pre>
        </div>
      )}
    </div>
  );
}
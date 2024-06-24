'use client'

import React, { useState } from 'react';

export default function TestPage() {
  const [artists, setArtists] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestAPI = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST' });
      const data = await res.json();

      console.log(data, 'data');
      
      // Parse the JSON string in the response
      const parsedData = JSON.parse(data.message.content);


      
      // Set the artists array from the parsed data
      setArtists(parsedData.artists);
    } catch (error) {
      console.error('Error:', error);
      setArtists([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test OpenAI API</h1>
      <button 
        onClick={handleTestAPI}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Loading...' : 'Test API'}
      </button>
      {artists.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Artists:</h2>
          <ul className="list-disc pl-5">
            {artists.map((artist, index) => (
              <li key={index}>{artist}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
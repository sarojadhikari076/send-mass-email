'use client';
import { processAirtableData } from '@/actions/sendEmail';
import Message from '@/components/Message';
import { Result } from '@/types/app';
import { useState } from 'react';

export default function Home() {
  const [tableName, setTableName] = useState('');
  const [result, setResult] = useState<Result>();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(undefined);
    setLoading(true);

    try {
      const response = await processAirtableData(tableName);
      setResult(response);
    } catch (error) {
      alert('Error fetching data from Airtable. Please check your Base ID.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col items-center justify-center p-5 gap-2" onSubmit={handleSubmit}>
      {result && <Message result={result} />}
      <h1 className="text-2xl font-bold text-green-600">Email Sender</h1>
      <input
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        type="text"
        placeholder="Enter Airtable Table Name"
        className="p-2 border border-gray-300 rounded-md md:w-96 w-full focus-within:outline-green-500 hover:border-green-500"
        required
      />
      <button
        className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-400 active:bg-green-600 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Send Emails'}
      </button>
    </form>
  );
}

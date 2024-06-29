'use client';
import { Result, getDatabase } from '@/actions/sendEmail';
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
      const response = await getDatabase(tableName);
      setResult(response);
    } catch (error) {
      alert('Error fetching data from Airtable. Please check your Base ID.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex min-h-screen flex-col items-center justify-center p-5 gap-2"
      onSubmit={handleSubmit}
    >
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
      <button className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-400 active:bg-green-600 transition-colors">
        {loading ? 'Loading...' : 'Send Emails'}
      </button>
    </form>
  );
}

function Message({ result }: { result: Result }) {
  const containerClasses = `px-4 py-2 ${
    result.status === 'success' ? 'bg-green-100' : 'bg-red-100'
  } ${
    result.status === 'success' ? 'text-green-800' : 'text-red-800'
  } rounded-md`;

  const messageClasses =
    result.status === 'success' ? 'text-green-800' : 'text-red-600';
  return (
    <div className={containerClasses}>
      <p className={messageClasses}>{result.message}</p>
    </div>
  );
}

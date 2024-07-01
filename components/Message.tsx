import { Result } from '@/types/app';

export default function Message({ result }: { result: Result }) {
  const containerClasses = `px-4 py-2 ${
    result.status === 'success' ? 'bg-green-100' : 'bg-red-100'
  } ${result.status === 'success' ? 'text-green-800' : 'text-red-800'} rounded-md text-sm`;

  const messageClasses = result.status === 'success' ? 'text-green-800' : 'text-red-600';
  return (
    <div className={containerClasses}>
      <p className={messageClasses}>{result.message}</p>
    </div>
  );
}

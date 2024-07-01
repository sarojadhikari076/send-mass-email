import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-3xl text-red-500 font-semibold">404 Not Found</h2>
      <p className="text-sm text-gray-700">
        The page you are looking for does not exist. Please check the URL and try again.
      </p>
      <Link href="/" className="underline text-green-500 block text-sm">
        Return Home
      </Link>
    </div>
  );
}

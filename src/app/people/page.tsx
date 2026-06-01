'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSearchUsers from '@/hooks/useSearchUsers';

export default function PeoplePage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useSearchUsers(debouncedQuery);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Find People</h1>

      <input
        type="text"
        placeholder="Search by name or username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
      />

      <div className="mt-6 space-y-3">
        {debouncedQuery.length < 3 && query.length > 0 && (
          <p className="text-stone-400 text-sm">Type at least 3 characters to search</p>
        )}

        {isLoading && <p className="text-stone-400 text-sm">Searching...</p>}

        {data && data.length === 0 && debouncedQuery.length >= 3 && (
          <p className="text-stone-400 text-sm">No users found</p>
        )}

        {data?.map((user) => (
          <Link
            key={user.id}
            href={`/u/${user.username}`}
            className="flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-lg hover:shadow-md transition-shadow"
          >
            {user.image ? (
              <Image src={user.image} alt="" className="w-10 h-10 rounded-full" width={40} height={40} />
            ) : (
              <div className="w-10 h-10 rounded-full bg-stone-200" />
            )}

            <div className="min-w-0">
              <p className="font-medium text-stone-900 truncate">{user.name || user.username}</p>
              <p className="text-sm text-stone-500">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-stone-400 truncate mt-0.5">{user.bio}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

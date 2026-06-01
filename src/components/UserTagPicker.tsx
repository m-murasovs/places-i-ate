'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { TaggedUser } from '@/Server/VisitService/VisitService';
import useSearchUsers from '@/hooks/useSearchUsers';

type UserTagPickerProps = {
    selectedUsers: TaggedUser[];
    onChange: (users: TaggedUser[]) => void;
    excludeUserId?: string;
};

export default function UserTagPicker({ selectedUsers, onChange, excludeUserId }: UserTagPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: searchResults } = useSearchUsers(debouncedQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside as EventListener);
        document.addEventListener('touchstart', handleClickOutside as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
            document.removeEventListener('touchstart', handleClickOutside as EventListener);
        };
    }, []);

    useEffect(() => {
        setShowDropdown(debouncedQuery.length >= 3);
    }, [debouncedQuery]);

    const selectedUserIds = new Set(selectedUsers.map(u => u.id));

    const filteredResults = (searchResults || []).filter(user =>
        user.id !== excludeUserId && !selectedUserIds.has(user.id)
    );

    const handleSelectUser = (user: TaggedUser) => {
        onChange([...selectedUsers, user]);
        setSearchQuery('');
        setShowDropdown(false);
    };

    const handleRemoveUser = (userId: string) => {
        onChange(selectedUsers.filter(u => u.id !== userId));
    };

    return (
        <div ref={containerRef} className='space-y-2'>
            <label className='block text-sm font-medium text-stone-700'>
                With (optional)
            </label>
            <div className='relative'>
                <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => debouncedQuery.length >= 3 && setShowDropdown(true)}
                    className='w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    placeholder='Search people...'
                    autoComplete='off'
                />
                {showDropdown && (
                    <div className='absolute z-10 mt-1 w-full bg-white border border-stone-200 rounded shadow-lg max-h-48 overflow-y-auto'>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((user) => (
                                <button
                                    key={user.id}
                                    type='button'
                                    onClick={() => handleSelectUser(user)}
                                    className='w-full text-left px-3 py-2 hover:bg-pink-50 text-sm flex items-center gap-2'
                                >
                                    {user.image && (
                                        <Image
                                            src={user.image}
                                            alt={user.name ?? user.username ?? ''}
                                            className='w-6 h-6 rounded-full object-cover'
                                            width={24}
                                            height={24}
                                        />
                                    )}
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{user.name}</span>
                                        <span className='text-stone-500'>@{user.username}</span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className='px-3 py-2 text-sm text-stone-400'>No users found</p>
                        )}
                    </div>
                )}
            </div>
            {selectedUsers.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                    {selectedUsers.map((user) => (
                        <div
                            key={user.id}
                            className='flex items-center gap-1 bg-pink-50 border border-pink-200 rounded-full px-2 py-1 text-sm'
                        >
                            {user.image && (
                                <Image
                                    src={user.image}
                                    alt={user.name ?? user.username ?? ''}
                                    className='w-5 h-5 rounded-full object-cover'
                                    width={20}
                                    height={20}
                                />
                            )}
                            <span>@{user.username}</span>
                            <button
                                type='button'
                                onClick={() => handleRemoveUser(user.id)}
                                className='text-stone-400 hover:text-stone-600 ml-1'
                                aria-label={`Remove @${user.username}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

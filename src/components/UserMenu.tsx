'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

type UserMenuProps = {
    image?: string | null;
    name?: string | null;
    username?: string | null;
};

export default function UserMenu({ image, name, username }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside as EventListener);
        document.addEventListener('touchstart', handleClickOutside as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
            document.removeEventListener('touchstart', handleClickOutside as EventListener);
        };
    }, []);

    return (
        <div ref={menuRef} className='relative'>
            <button
                onClick={() => setOpen(!open)}
                className='w-9 h-9 rounded-full overflow-hidden border-2 border-stone-200 hover:border-rose-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-1'
            >
                {image ? (
                    <Image src={image} alt={name ?? ''} className='w-full h-full object-cover' width={36} height={36} />
                ) : (
                    <span className='flex items-center justify-center w-full h-full bg-stone-200 text-stone-500 text-sm font-bold'>
                        {(name ?? username ?? '?')[0].toUpperCase()}
                    </span>
                )}
            </button>

            {open && (
                <div className='absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-50'>
                    {username && (
                        <Link
                            href={`/u/${username}`}
                            onClick={() => setOpen(false)}
                            className='block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50'
                        >
                            Profile
                        </Link>
                    )}
                    <button
                        onClick={() => signOut()}
                        className='w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50'
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { claimUsername } from '@/Server/actions/UserActions';
import { PrimaryButton } from '@/components/button';

export default function UsernameForm({ defaultUsername }: { defaultUsername: string }) {
    const [username, setUsername] = useState(defaultUsername);
    const [bio, setBio] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        try {
            await claimUsername(username, bio || undefined);
            router.refresh();
            router.push('/');
        } catch (err) {
            setError((err as Error).message);
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label htmlFor='username' className='block text-sm font-medium text-stone-700'>
                    Username
                </label>
                <div className='mt-1 flex items-center'>
                    <span className='text-stone-400 text-sm mr-1'>/u/</span>
                    <input
                        id='username'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='block w-full p-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        placeholder='your-username'
                        required
                        minLength={2}
                        maxLength={30}
                        pattern='[a-zA-Z0-9_]+'
                        autoComplete='off'
                    />
                </div>
            </div>

            <div>
                <label htmlFor='bio' className='block text-sm font-medium text-stone-700'>
                    Bio (optional)
                </label>
                <textarea
                    id='bio'
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className='mt-1 block w-full p-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    rows={2}
                    placeholder='Tell people about yourself...'
                />
            </div>

            {error && <p className='text-red-600 text-sm'>{error}</p>}

            <PrimaryButton type='submit' disabled={isPending}>
                {isPending ? 'Saving...' : 'Claim username'}
            </PrimaryButton>
        </form>
    );
}

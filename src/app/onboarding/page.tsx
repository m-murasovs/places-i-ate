import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import UsernameForm from './UsernameForm';

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');
    if (session.user.username) redirect('/');

    const defaultUsername = (session.user.name ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');

    return (
        <div className='max-w-md mx-auto mt-12'>
            <h1 className='text-2xl font-bold text-stone-900 mb-2'>Choose your username</h1>
            <p className='text-stone-500 mb-6'>This will be your public profile URL.</p>
            <UsernameForm defaultUsername={defaultUsername} />
        </div>
    );
}

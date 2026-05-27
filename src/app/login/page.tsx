import { signIn } from '@/auth';
import { PrimaryButton } from '@/components/button';
import prisma from '@/lib/prisma';

function GitHubIcon() {
    return (
        <svg viewBox='0 0 16 16' className='w-5 h-5 fill-current' aria-hidden='true'>
            <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
        </svg>
    );
}

function SignInForm() {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('github');
            }}
        >
            <PrimaryButton type='submit' className='text-lg py-3 px-8 shadow-md w-full sm:w-auto inline-flex items-center gap-2'>
                <GitHubIcon />
                Sign in with GitHub
            </PrimaryButton>
        </form>
    );
}

const MOCK_VISITS = [
    { name: 'Artisan Bistro', address: '12 Oak St, Downtown', rating: '5', color: 'bg-lime-500', review: 'Best pasta in town' },
    { name: 'Sakura Sushi', address: '45 River Ave, Waterfront', rating: '4', color: 'bg-teal-400', review: 'Fresh fish, great vibe' },
    { name: 'Taco Haven', address: '78 Market Ln, Midtown', rating: '3', color: 'bg-amber-400 text-stone-800', review: 'Solid tacos, slow service' },
];

const FEATURES = [
    { icon: <svg viewBox='0 0 24 24' className='w-8 h-8 mx-auto text-rose-400' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M12 20h9' /><path d='M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z' /></svg>, heading: 'Log Visits', sub: 'Pick a restaurant, add a date and notes' },
    { icon: <svg viewBox='0 0 24 24' className='w-8 h-8 mx-auto text-amber-400' fill='currentColor'><path d='M12 2l2.9 6.3L22 9.2l-5 5.2L18.2 22 12 18.5 5.8 22 7 14.4l-5-5.2 7.1-.9z' /></svg>, heading: 'Rate 1-5 + S-tier', sub: 'Your personal scale, not someone else\'s' },
    { icon: <svg viewBox='0 0 24 24' className='w-8 h-8 mx-auto text-teal-400' fill='none' stroke='currentColor' strokeWidth='2'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' /><circle cx='12' cy='9' r='2.5' /></svg>, heading: 'Map View', sub: 'See everywhere you\'ve been on a map' },
    { icon: <svg viewBox='0 0 24 24' className='w-8 h-8 mx-auto text-rose-400' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2' /><circle cx='9' cy='7' r='4' /><path d='M23 21v-2a4 4 0 00-3-3.87' /><path d='M16 3.13a4 4 0 010 7.75' /></svg>, heading: 'Follow Friends', sub: 'See what people you trust are eating' },
];

export default async function LoginPage() {
    const totalVisits = await prisma.visit.count().catch(() => 0);

    return (
        <div className='max-w-4xl mx-auto'>
            <div className='min-h-[60vh] flex flex-col justify-center md:grid md:grid-cols-2 md:gap-16 md:items-center'>
                <div>
                    <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight'>
                        Track every bite, rate every place
                    </h1>
                    <p className='mt-4 text-lg text-stone-500 max-w-md'>
                        Your personal food diary. Log restaurant visits, rate them your way, and discover where your friends eat.
                    </p>
                    <div className='mt-8'>
                        <SignInForm />
                    </div>
                </div>

                <div className='hidden md:block'>
                    <div className='rounded-2xl bg-stone-50 border border-stone-200 p-6 space-y-3 shadow-inner'>
                        {MOCK_VISITS.map((v) => (
                            <div key={v.name} className='rounded-xl bg-white border border-stone-200 p-4 flex items-center justify-between'>
                                <div className='flex-1 min-w-0 mr-3'>
                                    <h3 className='font-semibold text-stone-900'>{v.name}</h3>
                                    <p className='text-sm text-stone-400'>{v.address}</p>
                                    <p className='text-sm text-stone-600 italic mt-1'>{v.review}</p>
                                </div>
                                <span className={`inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-full font-bold text-sm text-white ${v.color}`}>
                                    {v.rating}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16'>
                {FEATURES.map((f) => (
                    <div key={f.heading} className='rounded-xl border border-stone-100 bg-white p-5 text-center shadow-sm'>
                        <div className='mb-3'>{f.icon}</div>
                        <h3 className='text-sm font-semibold text-stone-800'>{f.heading}</h3>
                        <p className='text-xs text-stone-500 mt-1'>{f.sub}</p>
                    </div>
                ))}
            </div>

            {totalVisits > 0 && (
                <div className='mt-12 py-8 border-t border-b border-stone-100 text-center'>
                    <div className='text-4xl font-bold text-rose-500'>{totalVisits.toLocaleString()}</div>
                    <p className='text-stone-500 mt-1'>visit{totalVisits !== 1 ? 's' : ''} logged and counting</p>
                </div>
            )}

            <div className='mt-16 text-center pb-10'>
                <h2 className='text-2xl font-bold text-stone-900 mb-6'>Ready to start your food diary?</h2>
                <SignInForm />
            </div>
        </div>
    );
}

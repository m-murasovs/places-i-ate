'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
    const pathname = usePathname();
    const links = [
        { href: '/', label: 'Visits' },
        { href: '/map', label: 'Map' },
        { href: '/leaderboard', label: 'Top' },
        { href: '/people', label: 'People' },
    ];

    return (
        <>
            <nav className='hidden sm:flex gap-3 sm:gap-4'>
                {links.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm pb-1 border-b-2 transition-colors ${
                                isActive
                                    ? 'text-stone-900 font-medium border-rose-500'
                                    : 'text-stone-500 hover:text-stone-900 border-transparent'
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <nav className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 sm:hidden pb-[env(safe-area-inset-bottom)]'>
                <div className='flex'>
                    {links.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'text-rose-600 border-t-2 border-rose-500'
                                        : 'text-stone-500 border-t-2 border-transparent'
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

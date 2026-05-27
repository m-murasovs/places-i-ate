'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/', label: 'Visits' },
    { href: '/map', label: 'Map' },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className='flex gap-3 sm:gap-4'>
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
    );
}

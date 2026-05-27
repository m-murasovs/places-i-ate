export default function StarBadge({ label, className, size = 32 }: { label: string; className: string; size?: number }) {
    return (
        <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
            <svg viewBox='0 0 24 24' className='absolute inset-0 w-full h-full'>
                <path d='M12 2l2.9 6.3L22 9.2l-5 5.2L18.2 22 12 18.5 5.8 22 7 14.4l-5-5.2 7.1-.9z' fill='currentColor' />
            </svg>
            <span className='relative z-10 text-xs font-bold' style={{ color: 'inherit' }}>{label}</span>
        </span>
    );
}

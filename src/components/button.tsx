import React, { ButtonHTMLAttributes } from 'react';

const BUTTON_DEFAULT_STYLE = 'font-semibold py-2 px-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const ButtonBase = ({
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <button
        className={`${className} ${BUTTON_DEFAULT_STYLE}`}
        {...props}
    >
        {children}
    </button>;
};

export const PrimaryButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <ButtonBase className={`${props.className} bg-rose-500 hover:bg-rose-600 text-white focus-visible:ring-rose-400`} {...props} />;
};

export const SecondaryButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <ButtonBase className={`${props.className} bg-pink-100 hover:bg-pink-200 text-stone-700 focus-visible:ring-pink-300`} {...props} />;
};

import React, { ButtonHTMLAttributes } from 'react';

const BUTTON_DEFAULT_STYLE = 'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';

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
    return <ButtonBase className={`${props.className} bg-blue-500 hover:bg-blue-700 text-white`} {...props} />;
};

export const SecondaryButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <ButtonBase className={`${props.className} bg-gray-200 hover:bg-gray-300`} {...props} />;
};

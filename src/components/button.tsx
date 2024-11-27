import React, { ReactElement } from 'react';

interface Button {
    children: ReactElement | string;
    type?: 'submit' | 'reset' | 'button' | undefined;
    className?: string;
}

const BUTTON_DEFAULT_STYLE = 'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';

const ButtonBase = ({
    children,
    className,
    ...props
}: Button) => {
    return <button
        className={`${className} ${BUTTON_DEFAULT_STYLE}`}
        {...props}
    >
        {children}
    </button>;
};

export const PrimaryButton = (props: Button) => {
    return <ButtonBase className={`${props.className} bg-blue-500 hover:bg-blue-700 text-white`} {...props} />;
};

export const SecondaryButton = (props: Button) => {
    return <ButtonBase className={`${props.className} bg-gray-200 hover:bg-gray-300`} {...props} />;
};

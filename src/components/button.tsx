import React, { ReactElement } from 'react';

export const PrimaryButton = ({
    children,
    type,
    ...props
}: {
    type?: 'submit' | 'reset' | 'button' | undefined;
    children: ReactElement | string;
}) => {
    return <button
        type={type}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        {...props}
    >
        {children}
    </button>;
};

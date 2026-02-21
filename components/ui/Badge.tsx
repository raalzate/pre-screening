import React, { FC, ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'primary' | 'accent';
    className?: string;
}

const Badge: FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        success: 'bg-green-100 text-green-800 border-green-200',
        danger: 'bg-red-100 text-red-800 border-red-200',
        warning: 'bg-amber-100 text-amber-800 border-amber-200',
        neutral: 'bg-gray-100 text-gray-700 border-gray-200',
        primary: 'bg-blue-100 text-sofka-blue border-blue-200',
        accent: 'bg-cyan-100 text-sofka-light-blue border-cyan-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;

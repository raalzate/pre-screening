import React, { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

    const variants = {
        primary: 'bg-sofka-blue text-white hover:bg-[#001D3D] focus:ring-sofka-blue',
        secondary: 'bg-sofka-orange text-white hover:bg-[#E65200] focus:ring-sofka-orange',
        outline: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-sofka-light-blue focus:ring-sofka-light-blue',
        ghost: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400',
        danger: 'bg-sofka-error text-white hover:bg-red-700 focus:ring-sofka-error',
        success: 'bg-sofka-success text-white hover:bg-green-700 focus:ring-sofka-success',
        accent: 'bg-sofka-light-blue text-white hover:bg-[#00709A] focus:ring-sofka-light-blue',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;

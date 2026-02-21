import React, { FC, ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    footer?: ReactNode;
    header?: ReactNode;
    onClick?: () => void;
}

const Card: FC<CardProps> = ({ children, className = '', title, icon, action, footer, header, onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-gray-100 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {header ? header : (title || icon) && (
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-3">
                    {icon && <span className="text-sofka-light-blue">{icon}</span>}
                    {title && <h3 className="font-bold text-sofka-blue text-lg tracking-tight">{title}</h3>}
                </div>
                {action && <div className="flex items-center">{action}</div>}
            </div>
        )}
        <div className="p-6">
            {children}
        </div>
        {footer && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50">
                {footer}
            </div>
        )}
    </div>
);

export default Card;

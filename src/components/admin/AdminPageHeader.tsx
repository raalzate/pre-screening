'use client';

import React, { ReactNode } from 'react';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
}

export default function AdminPageHeader({ title, description, actions, children }: AdminPageHeaderProps) {
    return (
        <div className="mb-8 border-b border-gray-100 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
            {children && <div className="mt-6">{children}</div>}
        </div>
    );
}

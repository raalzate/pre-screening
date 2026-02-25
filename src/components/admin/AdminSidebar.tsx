'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavItems } from './navConfig';

export default function AdminSidebar() {
    const pathname = usePathname();

    const isLinkActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin' && !window.location.search;
        if (href.includes('?')) {
            const [path, search] = href.split('?');
            return pathname === path && window.location.search.includes(search);
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-72px)] sticky top-[72px] hidden md:block overflow-y-auto">
            <nav className="p-4 space-y-2">
                {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item.href);

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${active
                                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

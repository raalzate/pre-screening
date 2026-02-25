'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { adminNavItems } from './navConfig';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminHeader />
            <div className="flex flex-1">
                <AdminSidebar />
                <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation Bar (T017) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 px-2 shadow-lg">
                {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item.href);

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 ${active ? 'text-blue-600' : 'text-gray-400'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
                            <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-70'}`}>
                                {item.label.split(' ')[0]} {/* Shorten label for mobile if needed */}
                            </span>
                            {active && <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full" />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

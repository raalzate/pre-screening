'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const sofkaColors = {
    blue: '#002C5E',
    lightBlue: '#0083B3',
    orange: '#FF5C00',
    gray: '#F3F4F6',
    darkGray: '#4B5563',
};

export default function AdminHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/admin">
                    <Image
                        src="https://sofka.com.co/static/logo.svg"
                        alt="Sofka Technologies Logo"
                        className="h-10 w-auto"
                        width={200}
                        height={40}
                    />
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 hidden md:inline-block">
                        Administrador: <span className="text-gray-900">{user?.name || 'Admin'}</span>
                    </span>
                    <button
                        onClick={logout}
                        className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 border hover:bg-gray-50 bg-white"
                        style={{ color: sofkaColors.lightBlue, borderColor: sofkaColors.lightBlue }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    );
}

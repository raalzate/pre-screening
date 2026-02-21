import React from 'react';
import Link from 'next/link';

// Server component — no 'use client' needed here
export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-0">

            {children}
        </div>
    );
}

import React from 'react';
import AdminLayout from "@/src/components/admin/AdminLayout";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}

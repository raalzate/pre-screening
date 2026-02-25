import { Users, FileText, Layout, History } from 'lucide-react';

export const adminNavItems = [
    { id: 'candidates', label: 'Candidatos', href: '/admin', icon: Users },
    { id: 'studio', label: 'Admin Studio', href: '/admin/studio', icon: Layout },
    { id: 'forms', label: 'Formularios', href: '/admin?view=forms', icon: FileText },
    { id: 'history', label: 'Historial', href: '/admin?view=history', icon: History },
];

"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

interface AdminNotification {
  id: number;
  type: string;
  candidate_name: string;
  candidate_code: string;
  message: string;
  is_read: number;
  created_at: string;
}

const Icons = {
  Bell: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>,
  X: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Info: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line><line x1="12" y1="12" x2="12" y2="8"></line></svg>,
};

export const Header = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = status === "authenticated";
  const user = session?.user as any;
  const isAdmin = user?.role === 'admin';

  const fetchNotifications = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Polling every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAdmin, fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 w-full z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src="https://sofka.com.co/static/logo.svg"
              alt="Sofka Technologies Logo"
              width={120}
              height={30}
              priority
            />
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" && (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded-md"></div>
            )}

            {isAuthenticated && session.user && (
              <>
                <div className="flex items-center gap-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {session.user.name}
                  </span>
                </div>

                {/* Notifications Bell */}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
                      title="Notificaciones"
                    >
                      <Icons.Bell className="w-6 h-6" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                          {notifications.length}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                          <h3 className="font-bold text-gray-800">Notificaciones</h3>
                          <span className="text-xs text-gray-500">{notifications.length} nuevas</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                              <Icons.Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                              <p className="text-sm">No tienes notificaciones pendientes</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-50">
                              {notifications.map((n) => (
                                <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors group">
                                  <div className="flex gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                      <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                                        <Icons.Info className="w-4 h-4" />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-800 leading-snug">
                                        {n.message}
                                      </p>
                                      <p className="text-[10px] text-gray-400 mt-1 flex justify-between items-center">
                                        {new Date(n.created_at).toLocaleString()}
                                        <button
                                          disabled={loading}
                                          onClick={() => markAsRead(n.id)}
                                          className="text-blue-600 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                        >
                                          Marcar leída
                                        </button>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 text-sm rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

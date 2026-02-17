"use client";

import { useState } from "react";
import createApiClient from "@/lib/apiClient";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RetryButtonProps {
    retryCount: number;
}

export default function RetryButton({ retryCount }: RetryButtonProps) {
    const [loading, setLoading] = useState(false);
    const api = createApiClient();
    const router = useRouter();

    const maxRetries = 3;
    const remainingRetries = maxRetries - retryCount;

    const handleRetry = async () => {
        if (retryCount >= maxRetries) {
            toast.error("Has alcanzado el límite máximo de reintentos.");
            return;
        }

        if (!confirm(`¿Estás seguro de que deseas reintentar la evaluación? Tienes ${remainingRetries} reintentos restantes.`)) {
            return;
        }

        setLoading(true);
        try {
            await api.post("/user/retry", {});
            toast.success("Evaluación reiniciada. ¡Muchos éxitos!");
            // Forzar recarga o redirección para limpiar el estado de la UI
            router.push("/");
            router.refresh();
            // Pequeña demora para asegurar que la reubicación ocurra
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (error: any) {
            console.error("Error al reintentar:", error);
            const message = error.response?.data?.message || "Error al reiniciar la evaluación.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (retryCount >= maxRetries) {
        return (
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 italic">
                    Has alcanzado el límite máximo de 3 reintentos.
                </p>
            </div>
        );
    }

    return (
        <button
            onClick={handleRetry}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Reintentar Evaluación ({remainingRetries} reintentos restantes)
                </>
            )}
        </button>
    );
}

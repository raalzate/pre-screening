// src/hooks/useDisableShortcuts.ts
import { useEffect } from "react";

const useDisableShortcuts = () => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 1. Bloquear F12
            if (e.key === "F12") {
                e.preventDefault();
            }

            // 2. Definir combinaciones de teclas
            const isCtrl = e.ctrlKey;
            const isShift = e.shiftKey;
            const isAlt = e.altKey;
            const isMeta = e.metaKey; // Tecla Command en Mac

            // Windows/Linux: Ctrl + Shift + Letra
            // Mac: Cmd + Option + Letra
            const isDevToolsShortcut =
                (isCtrl && isShift) || (isMeta && isAlt);

            // Bloquear Inspector (I), Consola (J), Elementos (C), Fuente (U)
            if (isDevToolsShortcut && ["I", "J", "C", "K"].includes(e.key.toUpperCase())) {
                e.preventDefault();
            }

            // Bloquear Ctrl+U / Cmd+U (Ver código fuente)
            if ((isCtrl || isMeta) && e.key.toLowerCase() === "u") {
                e.preventDefault();
            }

            // Bloquear Ctrl+S / Cmd+S (Guardar página)
            if ((isCtrl || isMeta) && e.key.toLowerCase() === "s") {
                e.preventDefault();
            }
        };

        // 3. Bloquear clic derecho
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 4. TRAMPA ANTI-DEBUGGER (Opcional pero recomendada)
        // Se ejecuta cada segundo para verificar si las DevTools están abiertas
        const antiDebugInterval = setInterval(() => {
            // Solo ejecutar en producción para no molestarte mientras desarrollas
            if (process.env.NODE_ENV === 'production') {
                const start = performance.now();
                // eslint-disable-next-line no-debugger
                debugger;
                const end = performance.now();

                // Si hay una pausa significativa, es que el debugger se activó
                if (end - start > 100) {
                    // Opcional: Redirigir o mostrar alerta
                    // alert("Por favor cierra el inspector para continuar.");
                }
            }
        }, 1000);

        // listeners
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            clearInterval(antiDebugInterval);
        };
    }, []);
};

export default useDisableShortcuts;
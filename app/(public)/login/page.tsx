'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const sofkaColors = {
  blue: '#002C5E',
  lightBlue: '#0083B3',
  orange: '#FF5C00',
  gray: '#F3F4F6',
  darkGray: '#4B5563',
};

// Clave para guardar en localStorage
const RECENT_USERS_KEY = 'sofka_recent_users';

// Interface para el objeto que guardaremos en localStorage
interface SavedUser {
  name: string;
  code: string;
  formId: string;
}

// --- Icono de "X" para eliminar ---
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


function LoginContent() {
  const [code, setCode] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);

  // --- Lógica de Login (CON CORRECCIÓN de parseo JSON) ---
  const handleLoginAttempt = useCallback(async (loginCode: string) => {
    if (!loginCode) return;
    setError('');
    setLoading(true);
    try {
      // 1. loginResponse será el JSON string
      const loginResponse = await login(loginCode);

      // 2. Parsear la respuesta (¡IMPORTANTE!)
      let userData;
      if (typeof loginResponse === 'string') {
        userData = JSON.parse(loginResponse);
      } else if (typeof loginResponse === 'object' && loginResponse !== null) {
        userData = loginResponse; // Ya era un objeto
      } else {
        throw new Error("Respuesta de login desconocida.");
      }

      // 3. Validar el objeto parseado
      if (!userData || !userData.name || !userData.code || !userData.form_id) {
        throw new Error("El objeto de usuario no tiene 'name', 'code', o 'form_id'.");
      }

      // 4. Crear el objeto simple para guardar
      const userToSave: SavedUser = {
        name: userData.name,
        code: userData.code,
        formId: userData.form_id,
      };

      // 5. Guardar en estado y localStorage
      setSavedUsers(prevUsers => {
        const otherUsers = prevUsers.filter(u => u.code !== userToSave.code);
        const newUsers = [userToSave, ...otherUsers].slice(0, 5);
        try {
          localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(newUsers));
        } catch (e) {
          console.error("Error al guardar en localStorage:", e);
        }
        return newUsers;
      });

      // 6. Redirigir
      router.push('/');

    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Código inválido. Por favor, intenta de nuevo.');
      setCode(loginCode);
    } finally {
      setLoading(false);
    }
  }, [login, router]);


  // --- 2. NUEVA FUNCIÓN para eliminar un usuario reciente ---
  const handleDeleteRecentUser = useCallback((e: React.MouseEvent, codeToDelete: string) => {
    e.stopPropagation(); // Previene que se dispare el login

    // Actualiza el estado de React
    const newUsers = savedUsers.filter(user => user.code !== codeToDelete);
    setSavedUsers(newUsers);

    // Actualiza localStorage
    try {
      localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(newUsers));
    } catch (err) {
      console.error("Error al actualizar localStorage:", err);
    }
  }, [savedUsers]); // Depende del estado 'savedUsers'


  // Hook para LEER de localStorage al cargar
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(RECENT_USERS_KEY);
      if (storedUsers) {
        setSavedUsers(JSON.parse(storedUsers));
      }
    } catch (e) {
      console.error("Error al leer de localStorage:", e);
      localStorage.removeItem(RECENT_USERS_KEY);
    }
  }, []); // Se ejecuta solo al montar


  // Hook para leer el parámetro 'code' de la URL
  const searchParams = useSearchParams();
  useEffect(() => {
    const queryCode = searchParams.get('code');
    if (queryCode) {
      handleLoginAttempt(queryCode);
    }
  }, [searchParams, handleLoginAttempt]);


  // Manejador del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginAttempt(code);
  };


  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: sofkaColors.gray }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Image
            src="https://sofka.com.co/static/logo.svg"
            alt="Sofka Technologies Logo"
            width={120}
            height={30}
            priority
          />
          {/* Puedes mover el Link de Admin aquí si lo prefieres */}
        </div>
      </header>

      {/* Contenedor principal */}
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-12 items-start justify-center">

        {/* Columna Izquierda: Accesos Recientes */}
        <div className="w-full md:w-3/5 lg:w-3/5">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: sofkaColors.blue }}>
            Tu proceso de evaluación en Sofka
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: sofkaColors.darkGray }}>
            Bienvenido. Ingresa tu código o selecciona uno de tus accesos recientes para continuar.
          </p>

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8" style={{ color: sofkaColors.blue }}>
              Accesos Recientes
            </h2>

            {savedUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- 3. Tarjeta de Usuario MODIFICADA --- */}
                {savedUsers.map((user) => (
                  // Convertido en <div> 'relative' para posicionar el botón de borrar
                  <div
                    key={user.code}
                    className="relative p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: 'white' }}
                  >
                    {/* Botón principal de login */}
                    <button
                      onClick={() => handleLoginAttempt(user.code)}
                      disabled={loading}
                      className="w-full text-left focus:outline-none disabled:opacity-50 pr-8" // Padding derecho para no solapar con la 'X'
                      title={`Ingresar como ${user.name}`}
                    >
                      <span className="block text-lg font-semibold truncate" style={{ color: sofkaColors.blue }}>
                        {user.name}
                      </span>
                      <span className="block text-base font-mono mt-1" style={{ color: sofkaColors.darkGray }}>
                        {user.formId}
                      </span>
                    </button>

                    {/* Botón de eliminar (posicionado absoluto) */}
                    <button
                      onClick={(e) => handleDeleteRecentUser(e, user.code)}
                      disabled={loading}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:bg-red-100 focus:text-red-600 transition-colors disabled:opacity-50"
                      title={`Eliminar ${user.name}`}
                      aria-label={`Eliminar acceso reciente de ${user.name}`}
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}

              </div>
            ) : (
              // Mensaje si no hay usuarios guardados
              <div
                className="p-6 rounded-lg border-l-4"
                style={{ backgroundColor: 'white', borderColor: sofkaColors.lightBlue }}
              >
                <p style={{ color: sofkaColors.darkGray }}>
                  Aún no tienes accesos guardados.
                  <br />
                  Inicia sesión una vez y tu código aparecerá aquí para futuros ingresos.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Formulario de Login */}
        <div className="w-full md:w-2/5 lg:w-2/5 md:sticky md:top-20">
          <div className="p-8 rounded-lg shadow-xl space-y-6" style={{ backgroundColor: 'white' }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold" style={{ color: sofkaColors.darkGray }}>
                Ingresa tu código
              </h2>
              <p className="mt-2 text-sm" style={{ color: sofkaColors.darkGray }}>
                Para empezar, ingresa el código que se te ha proporcionado.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="sr-only">
                  Código
                </label>
                <input
                  id="code"
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código secreto"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition duration-300 focus:border-sofka-light-blue focus:ring-1 focus:ring-sofka-light-blue"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: sofkaColors.blue,
                  color: 'white',
                }}
              >
                {loading ? 'Validando...' : 'Ingresar'}
              </button>
              {error && (
                <p className="text-center text-red-600 font-medium">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* --- 4. Footer MODIFICADO con Link a /admin --- */}
      <footer className="bg-white border-t border-gray-200 py-6 text-sm" style={{ color: sofkaColors.darkGray }}>
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Sofka Technologies. All Rights Reserved.</p>
          <p className="mt-2">
            <Link href="/admin" className="font-medium text-gray-600 hover:text-sofka-blue transition-colors">
              Ir al Panel de Administrador
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function CombinedLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">Cargando...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
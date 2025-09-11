import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Página No Encontrada</h1>
      <p className="mt-4">Lo sentimos, la página que buscas no existe.</p>
      <Link href="/" className="mt-8 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
        Volver al inicio
      </Link>
    </div>
  );
}

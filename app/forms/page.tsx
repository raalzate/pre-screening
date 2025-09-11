import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-4xl font-bold">🚀 Dynamic Forms para Entrevistas</h1>
      <Link
        href="/forms"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Ver Formularios
      </Link>
    </main>
  );
}

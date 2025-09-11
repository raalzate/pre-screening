import DynamicForm from "@/components/DynamicForm";
import { FormConfig } from "@/types/InputConfig";

// Página Next.js con SSR
export default async function FormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Error cargando el formulario");
  }

  const form: FormConfig = await res.json();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <DynamicForm form={form} />
    </div>
  );
}

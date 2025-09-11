import { NextResponse } from "next/server";

// app/api/forms/[id]/route.ts
import path from "path";
import { promises as fs } from "fs";
import { FormConfig } from "@/types/InputConfig";


export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
          const { id } = await params; 

        // Ruta a la carpeta donde están los JSON de formularios
        const formsDir = path.join(process.cwd(), "data", "forms");
        // Leer archivo JSON con el id solicitado
        const filePath = path.join(formsDir, `${id}.json`);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const formConfig: FormConfig = JSON.parse(fileContent);

        return NextResponse.json(formConfig);
    } catch (error) {
        console.error("Error leyendo formulario:", error);
        return NextResponse.json(
            { error: `Formulario con id ${id} no encontrado` },
            { status: 404 }
        );
    }
}

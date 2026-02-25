import { NextResponse } from "next/server";
import { db, initDb } from '@/lib/db';
import { sendCandidateWelcomeEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { config } from "@/lib/config";

/*
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","code":"12345","requirements":"deuna","step":"pre-screening","form_id":"nestjs-ssr"}'
*/
export async function POST(request: Request) {
  try {
    await initDb();

    const { name, email, code, requirements, step, form_id } = await request.json();

    if (!name || !code || !requirements || !step || !form_id) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const createdBy = (session?.user as any)?.email || config.DEFAULT_RECRUITER_EMAIL;

    await db.execute(`
      INSERT INTO users (name, email, code, requirements, step, form_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(code, requirements, form_id) DO UPDATE SET
        name=excluded.name,
        email=excluded.email,
        step=excluded.step,
        created_by=excluded.created_by
    `, [name, email, code, requirements, step, form_id, createdBy]);

    // Send email to candidate
    if (email) {
      try {
        await sendCandidateWelcomeEmail(name, email, code);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // We continue because the user was created, but log the error
      }
    }

    return NextResponse.json({ message: "Usuario guardado y correo enviado correctamente" });
  } catch (error: any) {
    console.error("Error en user API:", error);
    return NextResponse.json({ message: "Error al crear el usuario" }, { status: 500 });
  }
}

/*
curl "http://localhost:3000/api/user?code=12345"

*/
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url, "http://n");
    const code = searchParams.get("code")?.trim();
    const requirements = searchParams.get("requirements")?.trim();
    const formId = searchParams.get("formId")?.trim();

    if (code) {
      // Buscar usuario por code y optional requirements/formId
      let query = "SELECT * FROM users WHERE code = ?";
      const args = [code];

      if (requirements) {
        query += " AND requirements = ?";
        args.push(requirements);
      }

      if (formId) {
        query += " AND form_id = ?";
        args.push(formId);
      }

      const result = await db.execute(query, args);

      if (result.rows.length === 0) {
        // Fallback: Buscar en history_candidates
        let historyQuery = "SELECT * FROM history_candidates WHERE code = ?";
        const historyArgs = [code];

        if (requirements) {
          historyQuery += " AND requirements = ?";
          historyArgs.push(requirements);
        }

        if (formId) {
          historyQuery += " AND form_id = ?";
          historyArgs.push(formId);
        }

        // Ordenar por fecha de movimiento descendente para obtener el más reciente si hay varios
        historyQuery += " ORDER BY moved_at DESC LIMIT 1";

        const historyResult = await db.execute(historyQuery, historyArgs);

        if (historyResult.rows.length === 0) {
          return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        const user = { ...historyResult.rows[0] };
        return NextResponse.json(user);
      }

      // Convertir a objeto plano
      const user = { ...result.rows[0] };
      return NextResponse.json(user);
    } else {
      // Listar todos los usuarios
      const result = await db.execute("SELECT * FROM users");
      const users = result.rows.map(row => ({ ...row }));

      return NextResponse.json(users);
    }
  } catch (error: any) {
    console.error("Error en user API (GET):", error);
    return NextResponse.json({ message: "Error al obtener usuarios" }, { status: 500 });
  }
}

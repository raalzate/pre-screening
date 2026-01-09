import { NextResponse } from "next/server";
import { db, initDb } from '@/lib/db';
import { sendCandidateWelcomeEmail } from "@/lib/email";

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

    await db.execute(`
      INSERT INTO users (name, email, code, requirements, step, form_id)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(code) DO UPDATE SET
        name=excluded.name,
        email=excluded.email,
        requirements=excluded.requirements,
        step=excluded.step,
        form_id=excluded.form_id
    `, [name, email, code, requirements, step, form_id]);

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
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      // Buscar usuario por code
      const result = await db.execute("SELECT * FROM users WHERE code = ?", [code]);

      if (result.rows.length === 0) {
        return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
      }

      // Convertir a objeto plano para evitar problemas de serialización si los hay
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

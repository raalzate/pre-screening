import { NextResponse } from "next/server";
import { db, initDb } from '@/lib/db';

/*
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","code":"12345","requirements":"deuna","step":"pre-screening","form_id":"nestjs-ssr"}'
*/
export async function POST(request: Request) {
  try {
    await initDb();

    const { name, code, requirements, step, form_id } = await request.json();

    if (!name || !code || !requirements || !step || !form_id) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await db.execute(`
      INSERT INTO users (name, code, requirements, step, form_id)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(code) DO UPDATE SET
        name=excluded.name,
        requirements=excluded.requirements,
        step=excluded.step,
        form_id=excluded.form_id
    `, [name, code, requirements, step, form_id]);


    return NextResponse.json({ message: "Usuario guardado o actualizado correctamente" });
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
      const user = await db.execute("SELECT * FROM users WHERE code = ?", [code]);

      if (!user) {
        return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
      }

      return NextResponse.json(user.rows[0]);
    } else {
      // Listar todos los usuarios
      const users = await db.execute("SELECT * FROM users");

      return NextResponse.json(users.rows);
    }
  } catch (error: any) {
    console.error("Error en user API (GET):", error);
    return NextResponse.json({ message: "Error al obtener usuarios" }, { status: 500 });
  }
}

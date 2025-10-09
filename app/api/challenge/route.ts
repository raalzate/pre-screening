import { NextResponse } from "next/server";
import { challengeGenerator } from "@/lib/ia/challengeGenerator";
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const challenge = await challengeGenerator.generate(body.evaluationResult);

  // Obtener el código de usuario del header
  const userCode = req.headers.get('x-user-code');

  // Si hay código de usuario, actualiza evaluation_result
  if (userCode) {
    await db.execute(`
                UPDATE users
                SET challenge_result = ?
                WHERE code = ?
            `, [JSON.stringify(challenge), userCode]);
  }

  return NextResponse.json(challenge);
}

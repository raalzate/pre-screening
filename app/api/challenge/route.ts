import { NextResponse } from "next/server";
import { ChallengeGenerator } from "@/lib/ChallengeGenerator";
import db from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const challengeGenerator = new ChallengeGenerator();
  const challenge = await challengeGenerator.generate(body.evaluationResult);

  // Obtener el código de usuario del header
  const userCode = req.headers.get('x-user-code');

  // Si hay código de usuario, actualiza evaluation_result
  if (userCode) {
    const stmt = db.prepare(`
                UPDATE users
                SET challenge_result = ?
                WHERE code = ?
            `);
    stmt.run(JSON.stringify(challenge), userCode);
  }

  return NextResponse.json(challenge);
}

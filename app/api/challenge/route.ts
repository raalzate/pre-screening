import { NextResponse } from "next/server";
import { challengeGenerator } from "@/lib/ia/challengeGenerator";
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const challenge = await challengeGenerator.generate(body.evaluationResult);

  const session = await getServerSession(authOptions);
  const userCode = (session?.user as any)?.code;

  // Si hay código de usuario, actualiza evaluation_result
  if (userCode) {
    await db.execute(`
                UPDATE users
                SET challenge_result = ?, step = ?
                WHERE code = ?
            `, [JSON.stringify(challenge), "interview", userCode]);
  }

  return NextResponse.json(challenge);
}

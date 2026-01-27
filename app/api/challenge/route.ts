import { NextResponse } from "next/server";
import { challengeGenerator } from "@/lib/ia/challengeGenerator";
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const NIVELS = {
  "jr": "Júnior",
  "ssr": "Semi-Senior",
  "sr": "Senior"
}

export async function POST(req: Request) {
  const body = await req.json();

  const session = await getServerSession(authOptions);
  const userCode = (session?.user as any)?.code;
  const requirements = (session?.user as any)?.requirements;

  const challenge = await challengeGenerator.generate({
    ...body.evaluationResult,
    requirements: (NIVELS[requirements.split('-').at(-1) as keyof typeof NIVELS] ?? 'Desconocido'),
  });

  // Si hay código de usuario, actualiza evaluation_result
  if (userCode) {
    await db.execute(`
                UPDATE users
                SET challenge_result = ?, step = ?
                WHERE code = ? AND requirements = ?
            `, [JSON.stringify(challenge), "interview", userCode, requirements]);
  }

  return NextResponse.json(challenge);
}

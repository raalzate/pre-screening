import { NextResponse } from "next/server";
import { ChallengeGenerator } from "@/lib/ChallengeGenerator";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("📌 Generar reto técnico:", body);

  const challengeGenerator = new ChallengeGenerator();
  const challenge = await challengeGenerator.generate(body);

  return NextResponse.json(challenge);
}

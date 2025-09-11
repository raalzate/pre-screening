import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("📌 Generar reto técnico:", body);

  // Aquí podrías generar un reto real basado en gaps
  return NextResponse.json({
    challengeId: "challenge-" + Date.now(),
    message: "Reto técnico creado basado en los gaps detectados",
    gaps: body.gaps,
  });
}
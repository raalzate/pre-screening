"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from "recharts";

interface Gap {
  skill: string;
  required: number;
  got: number;
}

interface ResultChartProps {
  opportunityTitle: string;
  gaps: Gap[];
}

export default function ResultChart({ opportunityTitle, gaps }: ResultChartProps) {
  // Transformar gaps en data para el radar
  const data = gaps.map(g => ({
    skill: g.skill,
    Requerido: g.required,
    Obtenido: g.got,
  }));

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">{opportunityTitle}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis domain={[0, 5]} />
          <Radar name="Requerido" dataKey="Requerido" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Obtenido" dataKey="Obtenido" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

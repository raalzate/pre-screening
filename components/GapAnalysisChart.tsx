// components/GapAnalysisRechart.tsx
"use client";

import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Definimos el tipo para los datos de brechas
interface Gap {
  skill: string;
  got: number;
  required: number;
}

interface GapAnalysisRechartProps {
  gaps: Gap[];
}

export const GapAnalysisRechart: React.FC<GapAnalysisRechartProps> = ({ gaps }) => {


  const maxScore = Math.ceil(Math.max(...gaps.map((g) => g.required), 0));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        cx="50%"           // Centrado horizontal
        cy="50%"           // Centrado vertical
        outerRadius="80%"  // Radio exterior (80% del contenedor)
        data={gaps}
      >
        <PolarGrid stroke="#e0e0e0" />

        <PolarAngleAxis
          dataKey="skill"
          fontSize={12}
          tick={{ fill: '#333' }}
        />

        <PolarRadiusAxis
          angle={90} // Posición de las etiquetas (0, 2, 4...)
          domain={[0, maxScore]} // Escala de 0 al máximo puntaje requerido
          fontSize={10}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #cccccc",
            borderRadius: "8px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "14px" }} />

        <Radar
          name="Requerido"
          dataKey="required"
          stroke="#FF5C00" // Sofka Orange
          fill="#FF5C00"
          fillOpacity={0.4}
        />
        <Radar
          name="Obtenido"
          dataKey="got"
          stroke="#002C5E" // Sofka Blue
          fill="#002C5E"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
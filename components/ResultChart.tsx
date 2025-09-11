'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';

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
  const data = gaps.map(g => ({
    skill: g.skill,
    Requerido: g.required,
    Obtenido: g.got,
  }));

  return (
    <div className="p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{opportunityTitle}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#4A5568', fontSize: 14 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#718096' }} />
          <Radar 
            name="Requerido"
            dataKey="Requerido"
            stroke="#4299E1" 
            fill="#4299E1"
            fillOpacity={0.6}
          />
          <Radar 
            name="Obtenido" 
            dataKey="Obtenido" 
            stroke="#48BB78" 
            fill="#48BB78" 
            fillOpacity={0.7}
           />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#E2E8F0',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '10px 15px'
            }} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

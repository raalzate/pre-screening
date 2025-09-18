'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [index, setIndex] = useState(0);

  const data = gaps.map((g) => ({
    skill: g.skill,
    Requerido: g.required,
    Obtenido: g.got,
  }));

  const charts = [
    {
      id: "radar",
      label: "Radar",
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#4A5568', fontSize: 13 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#718096', fontSize: 12 }} />
            <Radar name="Requerido" dataKey="Requerido" stroke="#4299E1" fill="#4299E1" fillOpacity={0.6} />
            <Radar name="Obtenido" dataKey="Obtenido" stroke="#48BB78" fill="#48BB78" fillOpacity={0.7} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#E2E8F0',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '10px 15px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "bars",
      label: "Barras",
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="skill" tick={{ fill: '#4A5568', fontSize: 13 }} />
            <YAxis domain={[0, 5]} tick={{ fill: '#718096', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#E2E8F0',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '10px 15px',
              }}
            />
            <Legend />
            <Bar dataKey="Requerido" fill="#4299E1" />
            <Bar dataKey="Obtenido" fill="#48BB78" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <div className="p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{opportunityTitle}</h2>
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={charts[index].id}
            initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: index === 0 ? 50 : -50 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {charts[index].component}
          </motion.div>
        </AnimatePresence>
      </div>

     
      <div className="flex justify-center space-x-4 mt-6 pb-6">
        {charts.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setIndex(i)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              i === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
         <div className="mb-8  p-6 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm text-gray-700 text-left">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Escala de Puntuación</h3>
        <p className="text-sm leading-relaxed ">
          En las gráficas encontrarás con escalas de <strong>0-5 puntos</strong>, que corresponde a:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-1 text-sm">
          <li><strong>0</strong> = No conoce</li>
          <li><strong>1</strong> = Conocimiento muy básico o teórico mínimo</li>
          <li><strong>2</strong> = Conocimiento teórico y algo de práctica limitada</li>
          <li><strong>3</strong> = Experiencia práctica en proyectos</li>
          <li><strong>4</strong> = Experiencia sólida y autónoma en proyectos reales</li>
          <li><strong>5</strong> = Dominio profundo y liderazgo/innovación</li>
        </ul>
      </div>
    </div>
  );
}

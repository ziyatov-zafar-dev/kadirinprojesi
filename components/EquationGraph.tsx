
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { EquationCoefficients, GraphPoint } from '../types';

interface EquationGraphProps {
  coeffs: EquationCoefficients;
}

export const EquationGraph: React.FC<EquationGraphProps> = ({ coeffs }) => {
  const data = useMemo(() => {
    const points: GraphPoint[] = [];
    const { a, b, c } = coeffs;
    
    // Tepe noktası civarında odaklanalım
    const centerX = a !== 0 ? -b / (2 * a) : 0;
    const range = 10;
    
    for (let x = centerX - range; x <= centerX + range; x += 0.5) {
      const y = a * x * x + b * x + c;
      points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
    return points;
  }, [coeffs]);

  return (
    <div className="w-full h-[400px] bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
      <h3 className="text-lg font-semibold mb-4 text-slate-300">Fonksiyon Grafiği: y = {coeffs.a}x² + {coeffs.b}x + {coeffs.c}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="x" 
            stroke="#94a3b8" 
            type="number" 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
          <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

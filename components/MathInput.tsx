
import React from 'react';

interface MathInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export const MathInput: React.FC<MathInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-400 math-font">{label} katsayısı</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all math-font text-xl text-center"
        placeholder="0"
      />
    </div>
  );
};

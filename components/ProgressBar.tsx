
import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">Progresso do Aluno</span>
        <span className="text-sm font-bold text-teal-400">{percentage}% Concluído</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2.5">
        <div 
          className="bg-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

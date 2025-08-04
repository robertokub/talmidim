
import React, { useMemo } from 'react';
import { AllStudentsProgress } from '../types';
import { TrophyIcon } from './icons';

interface RankingProps {
  studentNames: string[];
  progressData: AllStudentsProgress;
  totalActions: number;
}

const Ranking: React.FC<RankingProps> = ({ studentNames, progressData, totalActions }) => {
  const rankedStudents = useMemo(() => {
    return studentNames
      .map(name => {
        const progress = progressData[name];
        if (!progress) return { name, score: 0, percentage: 0 };
        
        const score = progress.watchedVideos.length + progress.readPdfs.length + progress.commentedLessons.length;
        const percentage = totalActions > 0 ? Math.round((score / totalActions) * 100) : 0;
        
        return { name, score, percentage };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }, [progressData, totalActions, studentNames]);
  
  const getMedalColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-gray-400';
    if (rank === 2) return 'text-amber-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-teal-400 flex items-center">
        <TrophyIcon className="w-6 h-6 mr-2" />
        Ranking dos Alunos
      </h2>
      <ul className="space-y-4">
        {rankedStudents.map((student, index) => (
          <li key={student.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`w-8 text-lg font-bold text-center ${getMedalColor(index)}`}>{index + 1}.</span>
              <TrophyIcon className={`w-5 h-5 mr-3 ${getMedalColor(index)}`} />
              <span className="font-medium text-gray-200">{student.name}</span>
            </div>
            <div className="flex items-center w-1/3">
              <div className="w-full bg-gray-600 rounded-full h-2.5 mr-3">
                <div 
                  className="bg-teal-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${student.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-teal-400 w-16 text-right">{student.score} pts</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;

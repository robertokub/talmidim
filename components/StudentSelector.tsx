
import React from 'react';
import { UserIcon } from './icons';

interface StudentSelectorProps {
  students: string[];
  selectedStudent: string;
  onSelectStudent: (student: string) => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({ students, selectedStudent, onSelectStudent }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <UserIcon className="w-5 h-5 text-gray-400" />
      </div>
      <select
        value={selectedStudent}
        onChange={(e) => onSelectStudent(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
        aria-label="Selecionar Aluno"
      >
        {students.map(student => (
          <option key={student} value={student}>
            {student}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StudentSelector;

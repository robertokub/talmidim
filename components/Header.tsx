
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-0 z-20 shadow-lg shadow-black/20">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-teal-400 tracking-wider">Trilha de Aprendizagem Interativa</h1>
      </div>
    </header>
  );
};

export default Header;

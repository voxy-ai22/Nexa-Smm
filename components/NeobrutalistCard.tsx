
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const NeobrutalistCard: React.FC<Props> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white neo-border neo-shadow p-6 mb-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-[900] mb-6 uppercase tracking-tight border-b-4 border-black pb-2 flex items-center gap-2">
          <span className="w-3 h-3 bg-black"></span>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default NeobrutalistCard;

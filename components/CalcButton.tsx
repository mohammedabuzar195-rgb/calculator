
import React from 'react';

interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'equal';
  spanTwo?: boolean;
}

const CalcButton: React.FC<CalcButtonProps> = ({ label, onClick, variant = 'number', spanTwo = false }) => {
  const baseStyles = "h-16 md:h-20 flex items-center justify-center text-xl md:text-2xl font-semibold rounded-2xl transition-all duration-150 btn-active select-none";
  
  const variants = {
    number: "bg-white/5 hover:bg-white/10 text-white/90",
    operator: "bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300",
    action: "bg-rose-500/20 hover:bg-rose-500/40 text-rose-400",
    equal: "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${spanTwo ? 'col-span-2' : 'col-span-1'}`}
    >
      {label}
    </button>
  );
};

export default CalcButton;

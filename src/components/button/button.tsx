import React from 'react';

interface BtnProps {
  title: string;
  color?: string;
}

const Button = ({ title, color }: BtnProps) => {
  return (
    <button
      className={`mt-4 p-2 w-full text-white rounded font-bold ${
        color ? `bg-${color}` : 'bg-blue_2'
      }`}
    >
      {title}
    </button>
  );
};

export default Button;

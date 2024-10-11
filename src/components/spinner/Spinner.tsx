import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
     size = 'medium',
     color = 'text-blue_6'
   }) => {

    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };

  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] ${sizeClasses[size]} ${color} motion-reduce:animate-[spin_1.5s_linear_infinite]`}
         role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default Spinner;

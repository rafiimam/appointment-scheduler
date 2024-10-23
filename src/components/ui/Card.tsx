// src/components/ui/Card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardProps> = ({ children }) => {
  return <div className="border-b mb-4 pb-2">{children}</div>;
};

const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
};

const CardContent: React.FC<CardProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Card;
export { CardHeader, CardTitle, CardContent };

import React from 'react';

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ firstName, lastName, size = 'md' }) => {
  const getInitials = () => {
    // If both names are empty or undefined, return a question mark
    if (!firstName && !lastName) {
      return '?';
    }
    
    // Get first letter of first name (or ? if empty)
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '?';
    
    // Get first letter of last name (or ? if empty)
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '?';
    
    return `${firstInitial}${lastInitial}`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  } as const; // This makes the object immutable and helps TypeScript with type inference

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold transition-transform hover:scale-110 cursor-default`}
      title={`${firstName} ${lastName}`.trim() || 'User'}
    >
      {getInitials()}
    </div>
  );
};

export default Avatar; 
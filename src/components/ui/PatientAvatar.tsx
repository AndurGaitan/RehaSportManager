import React from 'react';
import { User } from 'lucide-react';
import { Gender } from '../../lib/types';
import { cn } from '../../lib/utils';
interface PatientAvatarProps {
  name: string;
  gender?: Gender;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};
const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8'
};
// Male icon - simple masculine silhouette
const MaleIcon = ({ className }: {className?: string;}) =>
<svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="7" r="4" />
    <path d="M12 13c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
  </svg>;

// Female icon - simple feminine silhouette with longer hair indication
const FemaleIcon = ({ className }: {className?: string;}) =>
<svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="7" r="4" />
    <path d="M12 13c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
    <path
    d="M7 7c0-1 .5-3 1-4 .5 1 1 2 1 3M16 7c0-1-.5-3-1-4-.5 1-1 2-1 3"
    opacity="0.6" />

  </svg>;

export const PatientAvatar = ({
  name,
  gender,
  size = 'md',
  className
}: PatientAvatarProps) => {
  const bgColor =
  gender === 'female' ?
  'bg-pink-100 text-pink-600' :
  gender === 'male' ?
  'bg-blue-100 text-blue-600' :
  'bg-gray-100 text-gray-500';
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0',
        sizeClasses[size],
        bgColor,
        className
      )}>

      {gender === 'female' ?
      <FemaleIcon className={iconSizes[size]} /> :
      gender === 'male' ?
      <MaleIcon className={iconSizes[size]} /> :

      <User className={iconSizes[size]} />
      }
    </div>);

};
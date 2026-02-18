import LogoIcon from '@/assets/svg/logo.svg?react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <LogoIcon className={className} />;
};

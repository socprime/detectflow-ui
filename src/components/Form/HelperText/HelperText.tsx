interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
}

export const HelperText = ({ children, className }: HelperTextProps) => {
  return <p className={className}>{children}</p>;
};

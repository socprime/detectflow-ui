import { TriangleAlertIcon } from 'lucide-react';

interface AlertProps {
  count: number;
  onClick?: () => void;
}

export const Alert = ({ count, onClick }: AlertProps) => {
  return (
    <div
      className="border-yellow/50 flex cursor-pointer items-center justify-center gap-1 rounded-md border px-1 py-0.5"
      onClick={onClick}
    >
      <TriangleAlertIcon className="text-yellow! size-3" />
      <span className="text-default text-3xs font-normal">{count}</span>
    </div>
  );
};

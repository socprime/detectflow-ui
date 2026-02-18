import { cn } from '@/utils/mergeClass';
import { LockIcon } from 'lucide-react';

interface EnterpriseFeatureNoticeProps {
  title?: string;
  description?: string;
  className?: string;
}

export const EnterpriseFeatureNotice: React.FC<EnterpriseFeatureNoticeProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-secondary border-border flex w-full max-w-[672px] flex-col items-center justify-center gap-5 rounded-md border px-12 pt-12 pb-16',
        className,
      )}
    >
      <div className="bg-success/10 flex h-20 w-20 items-center justify-center rounded-full">
        <LockIcon className="text-success size-12" />
      </div>
      {title && <h3 className="text-default text-lg font-bold">{title}</h3>}
      <p className="text-gray-chateau text-m max-w-[528px] text-center">
        {description ?? (
          <>
            This functionality is not supported in the open-source version of DetectFlow. Contact{' '}
            <a
              className="text-success font-bold underline"
              href="mailto:sales@socprime.com"
              rel="noopener noreferrer"
            >
              sales@socprime.com
            </a>{' '}
            to learn about this and other Enterprise features
          </>
        )}
      </p>
    </div>
  );
};

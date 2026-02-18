import { cn } from '@/utils';
import { Copy, CopyCheck, ListChevronsDownUp, ListChevronsUpDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from '../Tooltip';

interface TextTruncateProps {
  children: React.ReactNode;
  lines?: number;
  className?: string;
  textClassName?: string;
  showToggle?: boolean;
  showCopy?: boolean;
}

export const TextTruncate: React.FC<TextTruncateProps> = ({
  children,
  lines = 3,
  className,
  textClassName,
  showToggle = true,
  showCopy = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [hasBeenTruncated, setHasBeenTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        const isTruncated = contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setNeedsTruncation(isTruncated);
        if (isTruncated && !isExpanded) {
          setHasBeenTruncated(true);
        }
      }
    };

    setTimeout(checkTruncation, 0);
    window.addEventListener('resize', checkTruncation);

    return () => window.removeEventListener('resize', checkTruncation);
  }, [children, lines, isExpanded]);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    toggleExpanded();
  };

  const handleCopy = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    try {
      const textToCopy =
        typeof children === 'string' ? children : contentRef.current?.textContent || '';
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, handler: (e: React.KeyboardEvent) => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler(e);
    }
  };

  return (
    <div className={cn('relative flex flex-col', className)}>
      <div className={cn('flex items-start gap-2 break-words', textClassName)}>
        <div
          ref={contentRef}
          className="select-text"
          style={
            isExpanded
              ? {
                  display: 'block',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }
              : {
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: lines,
                  overflow: 'hidden',
                }
          }
        >
          {children}
        </div>
        {(showToggle && hasBeenTruncated) || showCopy ? (
          <div className="flex items-center gap-1 bg-inherit pl-1" style={{ zIndex: 10 }}>
            {showToggle && hasBeenTruncated && (
              <div
                role="button"
                tabIndex={0}
                onClick={handleToggle}
                onKeyDown={(e) => handleKeyDown(e, handleToggle)}
                className={cn(
                  'text-muted-foreground hover:text-success inline-flex cursor-pointer items-center gap-1 text-xs transition-colors hover:scale-105 active:scale-95',
                )}
              >
                <Tooltip content={isExpanded ? 'Hide text' : 'Show text'}>
                  {!needsTruncation && isExpanded ? (
                    <ListChevronsDownUp className="size-3" />
                  ) : (
                    <ListChevronsUpDown className="size-3" />
                  )}
                </Tooltip>
              </div>
            )}
            {showCopy && (
              <div
                role="button"
                tabIndex={0}
                onClick={handleCopy}
                onKeyDown={(e) => handleKeyDown(e, handleCopy)}
                className={cn(
                  'text-muted-foreground hover:text-success inline-flex cursor-pointer items-center justify-center text-xs transition-colors hover:scale-105 active:scale-95',
                  copied && 'text-success',
                )}
              >
                <Tooltip content="Copy text">
                  {copied ? <CopyCheck className="size-3" /> : <Copy className="size-3" />}
                </Tooltip>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

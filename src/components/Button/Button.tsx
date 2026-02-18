import { cn } from '@/utils';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Link, type LinkProps } from 'react-router-dom';

import './Button.scss';

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  loading?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  React.ComponentProps<'button'> & {
    to?: never;
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<LinkProps, 'to'> & {
    to: LinkProps['to'];
    href?: never;
    disabled?: never;
  };

type ButtonAsAnchor = ButtonBaseProps &
  React.ComponentProps<'a'> & {
    href: string;
    to?: never;
    disabled?: never;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

export const buttonVariants = cva(
  'flex items-center justify-center gap-2 whitespace-nowrap rounded-xs border-1 transition-all duration-200 outline-none',
  {
    variants: {
      variant: {
        primary:
          'btn px-4 border-btn-primary bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-active disabled:bg-btn-primary-disabled disabled:border-btn-primary-disabled disabled:text-subdued text-dark',
        primaryOutline:
          'btn px-4 border-btn-primary bg-transparent hover:bg-btn-primary/10 hover:border-btn-primary/50 active:bg-btn-primary/20 disabled:border-btn-primary-disabled disabled:bg-transparent dark:text-default light:text-dark',
        secondary:
          'btn px-4 border-border bg-btn-secondary hover:bg-btn-secondary-hover/30 active:bg-btn-secondary-active disabled:bg-btn-secondary-disabled dark:text-subdued light:hover:text-default light:text-dark',
        secondaryOutline:
          'btn px-4 border-border bg-transparent hover:bg-hover/60 active:bg-btn-secondary/20 disabled:border-btn-secondary-disabled disabled:bg-transparent dark:text-subdued light:text-dark ring-0',
        criticalOutline:
          'btn px-4 border-btn-destructive/30 bg-transparent hover:bg-btn-destructive-hover/20 hover:border-btn-destructive/30 active:bg-btn-destructive-active/20 disabled:border-btn-destructive-disabled disabled:bg-transparent text-critical/90 hover:text-critical',
        ghost:
          'btn px-4 border-transparent bg-transparent text-foreground [&_svg]:text-subdued active:bg-btn-primary/10 active:border-btn-primary/5 [&.is-active]:bg-btn-primary/10 [&.is-active]:border-btn-primary/50 [&.is-active_svg]:text-btn-primary [&:active_svg]:text-btn-primary hover:bg-btn-ghost hover:[&:not(.is-active)_svg]:text-subdued',
        outline: 'btn px-4 btn--outline',
        icon: 'btn px-1 btn--icon border-transparent dark:text-subdued light:text-dark hover:bg-hover dark:hover:text-success',
        custom: '',
      },
      size: {
        xxs: 'h-6',
        xs: 'h-7',
        s: 'h-8',
        m: 'h-9',
        l: 'h-10',
        xl: 'h-11',
        lg: 'h-12',
        custom: '',
      },
    },
    compoundVariants: [
      { variant: 'icon', size: 'xxs', className: 'w-6' },
      { variant: 'icon', size: 'xs', className: 'w-7' },
      { variant: 'icon', size: 's', className: 'w-8' },
      { variant: 'icon', size: 'm', className: 'w-9' },
      { variant: 'icon', size: 'l', className: 'w-10' },
      { variant: 'icon', size: 'xl', className: 'w-11' },
      { variant: 'icon', size: 'lg', className: 'w-12' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'm',
    },
  },
);

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  loading,
  children,
  disabled,
  to,
  href,
  ...props
}: ButtonProps) => {
  const classes = buttonVariants({ variant, size, className });
  const processedChildren =
    loading && React.Children.count(children) > 0
      ? (() => {
          const childrenArray = React.Children.toArray(children);
          const firstChild = childrenArray[0];

          if (React.isValidElement(firstChild)) {
            return [
              <Loader2 key="loader" className="size-4 animate-spin" />,
              ...childrenArray.slice(1),
            ];
          }
          return [<Loader2 key="loader" className="size-4 animate-spin" />, ...childrenArray];
        })()
      : children;

  const commonProps = {
    'data-slot': 'button',
    className: cn(classes, loading && 'opacity-50'),
    children: processedChildren,
  };

  if (asChild) {
    return <Slot {...commonProps} {...props} />;
  }

  if (to) {
    return <Link to={to} {...commonProps} {...(props as Omit<LinkProps, 'to'>)} />;
  }

  if (href) {
    const { className: anchorClassName, ...anchorProps } = props as React.ComponentProps<'a'>;
    return (
      <a
        href={href}
        {...commonProps}
        {...anchorProps}
        className={cn(commonProps.className, anchorClassName)}
      />
    );
  }

  return (
    <button
      {...commonProps}
      {...(props as React.ComponentProps<'button'>)}
      disabled={disabled || loading}
    />
  );
};

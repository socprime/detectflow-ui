import * as DialogPrimitive from '@radix-ui/react-dialog';
import { MenuIcon, XIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Logo } from '../Logo';
import { isNavItemActive, navItems } from '../navItems';

import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTrigger } from '@socprime/react-ui';
import { cn } from '@/utils';

export const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Open menu"
          className="border-border text-foreground hover:bg-hover flex size-10 cursor-pointer items-center justify-center rounded-full border transition-colors lg:hidden"
        >
          <MenuIcon className="size-5" />
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-sm" />
        <DialogPrimitive.Content asChild aria-describedby={undefined}>
          <motion.div
            className="border-border bg-primary fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col border-r shadow-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <DialogPrimitive.Title className="flex items-center gap-3">
                <Logo className="size-14" />
                <span className="text-lg font-semibold">Detect</span>
              </DialogPrimitive.Title>
              <DialogClose asChild>
                <button
                  aria-label="Close menu"
                  className="border-border text-foreground hover:bg-hover flex size-9 cursor-pointer items-center justify-center rounded-full border transition-colors"
                >
                  <XIcon className="size-4" />
                </button>
              </DialogClose>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              {navItems.map(({ id, label, icon }, index) => {
                const Icon = icon;
                const isActive = isNavItemActive(id, pathname);

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.25 }}
                  >
                    <DialogClose asChild>
                      <Link
                        to={id}
                        className={cn(
                          'group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors',
                          isActive ? 'bg-btn-primary/10' : 'hover:bg-hover',
                        )}
                      >
                        <span
                          className={cn(
                            'bg-btn-primary absolute inset-y-2 left-0 w-1 rounded-full transition-opacity',
                            isActive ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <Icon
                          className={cn(
                            'size-5 transition-colors',
                            isActive
                              ? 'text-btn-primary'
                              : 'text-subdued group-hover:text-foreground',
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm font-medium transition-colors',
                            isActive
                              ? 'text-foreground'
                              : 'text-subdued group-hover:text-foreground',
                          )}
                        >
                          {label}
                        </span>
                      </Link>
                    </DialogClose>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

'use client';

import { useState, ReactNode } from 'react';
import clsx from 'clsx';
import { Button, Icon } from '../../atoms';

interface AccordionProps {
  title: string;
  children: ReactNode;
  startOpen?: boolean;
}

export function Accordion({ title, children, startOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="">
      <Button
        variant='ghost'
        color="none"
        
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-0 py-3 text-left font-semibold text-gray-800 focus:outline-none focus:ring-0"
      >
        {title}
        <Icon
          name="down"
          size={20}
          className={clsx('transition-transform duration-300', {
            'transform rotate-180': isOpen,
          })}
        />
      </Button>
      <div
        className={clsx('overflow-hidden transition-all duration-300 ease-in-out', {
          'max-h-screen opacity-100': isOpen,
          'max-h-0 opacity-0': !isOpen,
        })}
      >
        <div className="pt-1 pb-4 px-1">{children}</div>
      </div>
    </div>
  );
}

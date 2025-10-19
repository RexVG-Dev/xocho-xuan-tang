'use client';

import { useState, ReactNode } from 'react';
import clsx from 'clsx';
import { Button, Icon } from '../../atoms';

interface AccordionProps {
  title: string;
  children: ReactNode;
  startOpen?: boolean;
  padding?: boolean;
  className?: string;
}

export function Accordion({ title, children, className, startOpen = false, padding = true }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className={clsx( className )}>
      <Button
        variant='ghost'
        color="none"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx('w-full flex justify-between items-center text-left font-semibold text-gray-800', {
          'p-2': padding,
        })}
      >
        {title}
        <Icon
          name="down"
          size={25}
          className={clsx('transition-transform duration-300 bg-gray-100 p-1 rounded-md', {
            'transform rotate-180': isOpen,
          })}
        />
      </Button>
      {isOpen && (children)}
    </div>
  );
}
